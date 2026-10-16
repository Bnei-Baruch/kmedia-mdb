import { all, call, put, select, spawn, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { getQuery, updateQuery as urlUpdateQuery } from './helpers/url';
import { GenerateSearchId } from '../helpers/search';
import { actions, isAgenticSearchType, SEARCH_TYPES, selectors, types } from '../redux/modules/search';
import { types as settingsTypes } from '../redux/modules/settings';
import { actions as mbdActions } from '../redux/modules/mdb';
import { actions as postsActions } from '../redux/modules/publications';
import { actions as filterActions, types as filterTypes } from '../redux/modules/filters';
import { actions as lessonsActions } from '../redux/modules/lessons';
import { actions as listsActions } from '../redux/modules/lists';
import { fetchAllSeries } from './lessons';
import { fetchViewsByUIDs } from './recommended';
import { filtersTransformer } from '../filters';
import { appendMention, applyParsedFilters, chipKey, groupSuggestions, removeMention, SLOT_TO_FILTER, SMART_NAMESPACE } from '../helpers/smartSearch';
import { push } from '@lagunovsky/redux-react-router';
import {
  filtersGetFiltersSelector,
  lessonsGetSeriesLoaded,
  searchGetDebSelector,
  searchGetPageNoSelector,
  searchGetPrevFilterParamsSelector,
  searchGetPrevQuerySelector,
  searchGetQuerySelector,
  searchGetQueryResultSelector,
  searchGetSmartLiveSelector,
  searchGetSmartMetaSelector,
  searchGetReasoningPreviousSearchesSelector,
  searchGetReasoningResultSelector,
  searchGetReasoningStatusSelector,
  searchGetSearchTypeSelector,
  searchGetSortBySelector,
  settingsGetContentLanguagesSelector,
  settingsGetPageSizeSelector,
  settingsGetUILangSelector,
  authGetUserSelector
} from '../redux/selectors';

// TODO: Use debounce after redux-saga updated.
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const statusPollIntervalMs = 2500;

const isDebEnabled = deb => deb === true || deb === 'true';
const connectionRefusedMessage = 'Connection refused. No response from server';

const reasoningStatusCompleted = status => !!status && (status.done || status.state === 'completed');
const reasoningStatusFailed = status => !!status && (status.state === 'failed' || status.phase === 'error');
const reasoningStatusCanceled = status => !!status && (status.state === 'canceled' || status.phase === 'canceled');
const reasoningStatusTerminal = status => reasoningStatusCompleted(status) || reasoningStatusFailed(status) || reasoningStatusCanceled(status);
const reasoningSearchIsRapid = searchType => searchType === SEARCH_TYPES.AGENTIC_RAPID;
const sharedReasoningState = state => state.search.reasoningByType?.[SEARCH_TYPES.AGENTIC];
const sharedReasoningStatus = state => sharedReasoningState(state)?.status;
const sharedReasoningResult = state => sharedReasoningState(state)?.result;
const sharedReasoningWip = state => !!sharedReasoningState(state)?.wip;
const isConnectionRefused = err => err?.code === 'ERR_CONNECTION_REFUSED' || err?.message?.includes('ERR_CONNECTION_REFUSED');
const responseStatus = value => value?.http_status || value?.status || value?.response?.status;
const isNotFound = value => responseStatus(value) === 404;
const combineFollowupQuery = (originalQuery, followupQuery) => [originalQuery, followupQuery].filter(Boolean).join('; ');
const sameSearchQuery = (a, b) => (a || '').trim() === (b || '').trim();

const isSearchPath = pathname => /(^|\/)search\/?$/.test(pathname || '');

const reasoningErrorMessage = err => {
  if (isConnectionRefused(err)) {
    return connectionRefusedMessage;
  }

  return err?.response?.data?.error || err?.message || 'Reasoning search failed';
};

const failedReasoningStatus = (sessionId, error, httpStatus) => {
  const data = typeof error === 'string' ? {} : error?.response?.data || {};

  return {
    session_id      : sessionId,
    state           : 'failed',
    phase           : 'error',
    done            : true,
    http_status     : httpStatus,
    message         : typeof error === 'string' ? error : reasoningErrorMessage(error),
    code            : data.code,
    field           : data.field,
    max_characters  : data.max_characters,
    actual_characters: data.actual_characters
  };
};

const buildReasoningError = (message, response = null) => {
  const error = new Error(message || 'Reasoning search failed');

  error.response = response || {
    status    : 500,
    statusText: 'Reasoning search failed',
    data      : {
      error: message || 'Reasoning search failed'
    }
  };

  return error;
};

function* fetchReasoningStatus(sessionId) {
  try {
    const response = yield call(Api.reasoningSearchStatus, sessionId);
    if (!response) {
      return failedReasoningStatus(sessionId, connectionRefusedMessage);
    }

    if (response.status >= 400) {
      return failedReasoningStatus(
        sessionId,
        buildReasoningError(response.data?.error || response.statusText || 'Reasoning search failed', response),
        response.status
      );
    }

    return response.data || null;
  } catch (err) {
    if (isConnectionRefused(err)) {
      return failedReasoningStatus(sessionId, connectionRefusedMessage);
    }

    return null;
  }
}

export function* recoverFollowupRequest(originalQuery, followupQuery, uiLang, deb, originalIsRapid, followupIsRapid) {
  let cacheData = null;
  try {
    const cacheResponse = yield call(Api.reasoningSearchCache, {
      q          : originalQuery,
      ui_language: uiLang,
      is_rapid   : originalIsRapid
    });
    cacheData = cacheResponse?.data;
  } catch (_) {
    cacheData = null;
  }

  if (cacheData?.cache_hit && cacheData.session_id) {
    return {
      keepResult: true,
      resultQuery: followupQuery,
      request   : {
        q          : followupQuery,
        session_id : cacheData.session_id,
        ui_language: uiLang,
        deb        : isDebEnabled(deb),
        is_rapid   : followupIsRapid
      }
    };
  }

  // If the expired session cannot be recovered, run a plain search that carries both user intents.
  const fallbackQuery = combineFollowupQuery(originalQuery, followupQuery);
  return {
    keepResult: false,
    resultQuery: fallbackQuery,
    request   : {
      q          : fallbackQuery,
      ui_language: uiLang,
      deb        : isDebEnabled(deb),
      is_rapid   : followupIsRapid
    }
  };
}

function* pollReasoningStatus(sessionId, searchType) {
  let polling = true;
  let finalStatus = null;

  while (polling) {
    const currentStatus = yield select(sharedReasoningStatus);
    if (!isAgenticSearchType(searchType) || currentStatus?.session_id !== sessionId) {
      return null;
    }

    if (currentStatus?.session_id === sessionId && reasoningStatusCanceled(currentStatus)) {
      finalStatus = currentStatus;
      polling = false;
      continue;
    }

    if (reasoningStatusTerminal(currentStatus)) {
      finalStatus = currentStatus;
      polling = false;
      continue;
    }

    const status = yield call(fetchReasoningStatus, sessionId);
    if (status) {
      const nextStatus = yield select(sharedReasoningStatus);
      if (nextStatus?.session_id !== sessionId) {
        return null;
      }

      if (reasoningStatusTerminal(nextStatus)) {
        finalStatus = nextStatus;
        polling = false;
        continue;
      }

      yield put(actions.reasoningStatusUpdate({ ...status, searchType }));
      if (reasoningStatusTerminal(status)) {
        finalStatus = status;
        polling = false;
        continue;
      }
    }

    if (polling) {
      yield call(delay, statusPollIntervalMs);
    }
  }

  return finalStatus;
}

function* fetchReasoningResult(sessionId, query, searchType) {
  const currentStatus = yield select(sharedReasoningStatus);
  if (!isAgenticSearchType(searchType) || currentStatus?.session_id !== sessionId) {
    return;
  }

  const resultResponse = yield call(Api.reasoningSearchResult, sessionId);
  if (!resultResponse?.data || resultResponse?.status >= 400) {
    throw buildReasoningError(
      resultResponse?.data?.error || 'Failed to fetch reasoning search result',
      resultResponse
    );
  }

  const nextStatus = yield select(sharedReasoningStatus);
  if (nextStatus?.session_id !== sessionId) {
    return;
  }

  yield put(actions.reasoningSearchSuccess({
    searchResults: resultResponse.data,
    query,
    searchType
  }));
}

function* finishReasoningSession(sessionId, query, searchType) {
  const finalStatus = yield call(pollReasoningStatus, sessionId, searchType);
  if (!finalStatus || reasoningStatusCanceled(finalStatus)) {
    return;
  }

  const currentResult = yield select(sharedReasoningResult);
  const wip = yield select(sharedReasoningWip);
  if (!wip && currentResult?.session_id === sessionId) {
    return;
  }

  if (reasoningStatusFailed(finalStatus)) {
    throw buildReasoningError(finalStatus?.message || 'Reasoning search failed');
  }

  yield call(fetchReasoningResult, sessionId, query, searchType);
}

function* runReasoningSession(sessionId, query, searchType) {
  try {
    yield call(finishReasoningSession, sessionId, query, searchType);
  } catch (err) {
    const currentStatus = yield select(sharedReasoningStatus);
    if (isAgenticSearchType(searchType) && currentStatus?.session_id === sessionId) {
      yield put(actions.reasoningStatusUpdate({ ...failedReasoningStatus(sessionId, err, responseStatus(err)), searchType }));
      yield put(actions.searchFailure({ error: err, searchType }));
    }
  }
}

function* cancelReasoningSearch() {
  const searchType = yield select(searchGetSearchTypeSelector);
  const status    = yield select(searchGetReasoningStatusSelector);
  const sessionId = status?.session_id;
  if (!sessionId) {
    return;
  }

  try {
    const response = yield call(Api.reasoningSearchCancel, sessionId);
    if (!response?.data || response?.status >= 400) {
      throw buildReasoningError(
        response?.data?.error || response?.statusText || 'Failed to cancel reasoning search',
        response
      );
    }

    yield* urlUpdateQuery(query => Object.assign(query, { session_id: null }));
  } catch (err) {
    yield put(actions.reasoningStatusUpdate({ ...failedReasoningStatus(sessionId, err, responseStatus(err)), searchType }));
    yield put(actions.searchFailure({ error: err, searchType }));
  }
}

export function* finishReasoningSearchNow() {
  const searchType = yield select(searchGetSearchTypeSelector);
  const status    = yield select(searchGetReasoningStatusSelector);
  const sessionId = status?.session_id;
  if (!sessionId) {
    return;
  }

  try {
    const response = yield call(Api.reasoningSearchFinishNow, sessionId);
    if (!response?.data || response?.status >= 400 || !response.data.result_ready) {
      throw buildReasoningError(
        response?.data?.error || response?.statusText || 'Reasoning search draft result is not ready',
        response
      );
    }

    const reasoningResult = yield select(searchGetReasoningResultSelector);
    const query = status.query
      || reasoningResult?.display_query
      || reasoningResult?.query
      || (yield select(searchGetQuerySelector));
    yield call(fetchReasoningResult, sessionId, query, searchType);
  } catch (err) {
    yield put(actions.reasoningStatusUpdate({ ...failedReasoningStatus(sessionId, err, responseStatus(err)), searchType }));
    yield put(actions.searchFailure({ error: err, searchType }));
  }
}

function* autocomplete(action) {
  try {
    if (!action.payload.autocomplete) {
      yield put(actions.autocompleteSuccess({ suggestions: [] }));
      return;
    }

    yield delay(100);  // Debounce autocomplete.
    const query            = yield select(state => selectors.getQuery(state.search));
    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const request          = {
      q: query,
      ui_language: uiLang,
      content_languages: contentLanguages,
    };
    const autocompleteId   = GenerateSearchId();
    let suggestions        = null;
    if (query) {
      const { data }      = yield call(Api.autocomplete, request);
      data.autocompleteId = autocompleteId;
      suggestions         = data;
    }

    // We need the id only for logging, not for API call as it will break caching.
    request.autocomplete_id = autocompleteId;
    yield put(actions.autocompleteSuccess({ request, suggestions }));
  } catch (err) {
    yield put(actions.autocompleteFailure(err));
  }
}

function getIdsForFetch(hits, types) {
  return hits.reduce((acc, val) => {
    if (types.includes(val._source.result_type)) {
      return acc.concat(val._source.mdb_uid);
    }

    return acc;
  }, []);
}

export function* search(action) {
  try {
    const query     = yield select(searchGetQuerySelector);
    const searchType = yield select(searchGetSearchTypeSelector);
    const deb        = yield select(searchGetDebSelector);
    const uiLang     = yield select(settingsGetUILangSelector);
    const isFollowup = action && action.type === types['search/reasoningFollowup'];
    const isExplicitSearch = action && action.type === types['search/search'] && !action.payload?.hydrated;
    const urlQuery   = yield* getQuery();

    // Redirect from home page.
    if (action && action.type === types['search/search'] && !action.payload) {
      yield put(push({ pathname: 'search' }));
      yield* urlUpdateQuery(q => Object.assign(q, {
        q: query,
        search_type: isAgenticSearchType(searchType) ? searchType : null,
        session_id : null
      }));
    }

    if (isAgenticSearchType(searchType)) {
      const user = yield select(authGetUserSelector);
      if (!user) {
        yield put(actions.searchFailure({ error: null, searchType }));
        return;
      }

      const previousReasoningResult = yield select(searchGetReasoningResultSelector);
      const previousReasoningSearches = yield select(searchGetReasoningPreviousSearchesSelector);
      const previousReasoningStatus = yield select(searchGetReasoningStatusSelector);
      const sessionIdFromPrevious   = previousReasoningResult?.session_id;
      const runningSessionId        = !reasoningStatusTerminal(previousReasoningStatus) ? previousReasoningStatus?.session_id : null;
      const restoreSessionId        = !isExplicitSearch && !isFollowup && urlQuery.search_type === searchType ? urlQuery.session_id : null;
      const originalReasoningResult = previousReasoningSearches?.[0] || previousReasoningResult;
      const originalQuery           = originalReasoningResult?.query || query?.trim();
      const originalIsRapid         = typeof originalReasoningResult?.is_rapid === 'boolean'
        ? originalReasoningResult.is_rapid
        : reasoningSearchIsRapid(searchType);
      const q                       = isFollowup ? action.payload?.query?.trim() : query?.trim();
      let request                   = {
        q,
        session_id : isFollowup ? sessionIdFromPrevious : undefined,
        cancel_session_id: !isFollowup && !restoreSessionId ? runningSessionId : undefined,
        ui_language: uiLang,
        deb        : isDebEnabled(deb),
        is_rapid   : reasoningSearchIsRapid(searchType)
      };
      let resultQuery               = isFollowup ? q : query;
      if (!q) {
        yield put(actions.searchFailure(null));
        return;
      }

      if (isFollowup && (!sessionIdFromPrevious || previousReasoningResult.followups_remaining <= 0)) {
        return;
      }

      if (restoreSessionId) {
        yield put(actions.reasoningSearchStart({
          keepResult : false,
          sessionId  : restoreSessionId,
          requestKind: 'initial',
          searchType,
          query      : resultQuery
        }));
        const status = yield call(fetchReasoningStatus, restoreSessionId);
        // URL sessions can expire on the backend. A 404 should silently restart the search.
        if (status && !isNotFound(status)) {
          yield put(actions.reasoningStatusUpdate({ ...status, searchType }));
          if (reasoningStatusCompleted(status)) {
            try {
              yield call(fetchReasoningResult, restoreSessionId, query, searchType);
              return;
            } catch (err) {
              if (!isNotFound(err)) {
                throw err;
              }
            }
          }

          if (!reasoningStatusFailed(status) && !reasoningStatusCanceled(status)) {
            yield spawn(runReasoningSession, restoreSessionId, query, searchType);
            return;
          }
        }

        yield* urlUpdateQuery(query => Object.assign(query, { session_id: null }));
      }

      if (!isFollowup && reasoningSearchIsRapid(searchType)) {
        let cacheData = null;
        try {
          const cacheResponse = yield call(Api.reasoningSearchCache, {
            q,
            ui_language: uiLang,
            is_rapid   : true
          });
          cacheData = cacheResponse?.data;
        } catch (_) {
          cacheData = null;
        }

        const cacheSessionId = cacheData?.cache_hit ? cacheData.session_id : null;
        if (cacheSessionId) {
          if (runningSessionId && runningSessionId !== cacheSessionId) {
            try {
              yield call(Api.reasoningSearchCancel, runningSessionId);
            } catch (_) {
              // Cached result is still valid even if best-effort cancellation fails.
            }
          }

          yield put(actions.reasoningSearchStart({
            keepResult : false,
            sessionId  : cacheSessionId,
            requestKind: 'initial',
            searchType,
            query      : resultQuery
          }));

          yield* urlUpdateQuery(query => Object.assign(query, { session_id: cacheSessionId }));
          yield call(fetchReasoningResult, cacheSessionId, query, searchType);
          return;
        }
      }

      yield put(actions.reasoningSearchStart({
        keepResult : isFollowup,
        sessionId  : sessionIdFromPrevious,
        requestKind: isFollowup ? 'followup' : 'initial',
        searchType,
        query      : resultQuery
      }));

      let startData;
      try {
        const { data } = yield call(Api.reasoningSearchStart, request);
        startData = data;
      } catch (err) {
        if (!isFollowup || !isNotFound(err)) {
          throw err;
        }

        // Follow-up sessions can expire. Recover the original search from cache, or start over with a combined query.
        const recovery = yield call(
          recoverFollowupRequest,
          originalQuery,
          q,
          uiLang,
          deb,
          originalIsRapid,
          reasoningSearchIsRapid(searchType)
        );
        const { keepResult, request: recoveryRequest, resultQuery: recoveryResultQuery } = recovery;
        request = recoveryRequest;
        resultQuery = recoveryResultQuery;
        if (!keepResult) {
          yield put(actions.updateQuery({ query: resultQuery, autocomplete: false }));
          yield put(actions.reasoningSearchStart({ keepResult: false, requestKind: 'initial', searchType, query: resultQuery }));
        }

        const { data } = yield call(Api.reasoningSearchStart, request);
        startData = data;
      }

      const sessionId           = startData?.session_id || request.session_id || sessionIdFromPrevious;
      if (!sessionId) {
        throw buildReasoningError('Reasoning search did not return a session ID');
      }

      yield* urlUpdateQuery(query => Object.assign(query, { session_id: sessionId }));
      yield put(actions.reasoningStatusUpdate({
        session_id: sessionId,
        state     : 'pending',
        phase     : 'pending',
        done      : false,
        query     : resultQuery,
        searchType
      }));

      yield spawn(runReasoningSession, sessionId, resultQuery, searchType);
      return;
    }

    const prevQuery = yield select(searchGetPrevQuerySelector);
    let pageNo      = yield select(searchGetPageNoSelector);

    // Prepare filters values.
    const filters         = yield select(state => filtersGetFiltersSelector(state, 'search'));
    const params          = filtersTransformer.toApiParams(filters);
    const filterKeyValues = Object.entries(params).map(([v, k]) => `${v}:${k}`).join(' ');
    const filterParams    = filterKeyValues ? ` ${filterKeyValues}` : '';

    // Clear pagination and filters on a new query. Filters are kept when smart search has just set them
    // for this query, and when the search is triggered by a filter change (chip removed in the omnibox).
    const keepFilters = !!action?.payload?.keepFilters || action?.type !== types['search/search'];
    if (prevQuery !== '' && prevQuery !== query && (pageNo !== 1 || (!!filterParams && !keepFilters))) {
      if (pageNo !== 1) {
        yield* urlUpdateQuery(query => Object.assign(query, { page: 1 }));
        pageNo = 1;
      }

      if (filterParams && !keepFilters) {
        for (const filter of filters) {
          const { name } = filter;
          yield put(filterActions.resetFilter('search', name));
        }
      }
    }

    if (action && action.type === filterTypes['filters/setFilterValueMulti']) {
      const prevFilterParams = yield select(searchGetPrevFilterParamsSelector);
      if (filterParams === prevFilterParams) {
        // Don't search if filters have not changed.
        return;
      }
    }

    // Only filters, no text: list items by filters like the lessons/events pages (search needs terms).
    if (!query?.trim() && filterParams) {
      const pageSize = yield select(settingsGetPageSizeSelector);
      yield put(listsActions.fetchSectionList(SMART_NAMESPACE, pageNo, { pageSize, withViews: true }));
      yield put(actions.filtersListing({ filterParams, pageNo }));
      return;
    }

    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const sortBy           = yield select(searchGetSortBySelector);

    const q = query?.trim() ? `${query.trim()}${filterParams}` : filterParams;
    if (!q) {
      // If no query nor filters, silently fail the request, don't sent request to backend.
      yield put(actions.searchFailure(null));
      return;
    }

    const request  = {
      q,
      sortBy,
      ui_language: uiLang,
      content_languages: contentLanguages,
      deb: isDebEnabled(deb),
      pageNo,
      pageSize: 20
    };

    yield put(actions.setWip());
    const { data } = yield call(Api.search, request);

    // We need the id only for logging, not for API call as it will break caching.
    const searchId = GenerateSearchId();
    request.searchId = searchId;
    data.search_result.searchId = searchId;

    if (Array.isArray(data.search_result.hits.hits) && data.search_result.hits.hits.length > 0) {
      // TODO edo: optimize data fetching
      // Server should return associated items (collections, units, posts...) together with search results
      // hmm, relay..., hmm ?
      const cIDsToFetch    = getIdsForFetch(data.search_result.hits.hits, ['collections']);
      const cuIDsToFetch   = getIdsForFetch(data.search_result.hits.hits, ['units', 'sources']);
      const postIDsToFetch = getIdsForFetch(data.search_result.hits.hits, ['posts']);
      const seriesLoaded   = yield select(lessonsGetSeriesLoaded);

      if (cuIDsToFetch.length === 0 && cIDsToFetch.length === 0 && postIDsToFetch.length === 0 && seriesLoaded) {
        yield put(actions.searchSuccess({ searchResults: data, searchRequest: request, filterParams, query, pageNo }));
        return;
      }

      const uiLang           = yield select(settingsGetUILangSelector);
      const contentLanguages = yield select(settingsGetContentLanguagesSelector);
      const requests         = [];
      if (cuIDsToFetch.length > 0) {
        requests.push(call(Api.units, {
          id: cuIDsToFetch,
          pageSize: cuIDsToFetch.length,
          ui_language: uiLang,
          content_languages: contentLanguages,
          with_files: true,
          with_derivations: true
        }));
      }

      if (cIDsToFetch.length > 0) {
        requests.push(call(Api.collections, {
          id: cIDsToFetch,
          pageSize: cIDsToFetch.length,
          ui_language: uiLang,
          content_languages: contentLanguages
        }));
      }

      if (postIDsToFetch.length > 0) {
        requests.push(call(Api.posts, {
          id: postIDsToFetch,
          pageSize: postIDsToFetch.length,
          ui_language: uiLang,
          content_languages: contentLanguages
        }));
      }

      if (!seriesLoaded) {
        // Load lesson series if were not loaded yet or language was changed.
        requests.push(call(fetchAllSeries, lessonsActions.fetchAllSeries({ with_units: true })));
      }

      if (cuIDsToFetch.length > 0) {
        requests.push(call(fetchViewsByUIDs, cuIDsToFetch));
      }

      const responses = yield all(requests);
      if (cuIDsToFetch.length > 0) {
        const respCU = responses.shift();
        yield put(mbdActions.receiveContentUnits(respCU.data.content_units));
      }

      if (cIDsToFetch.length > 0) {
        const respC = responses.shift();
        yield put(mbdActions.receiveCollections(respC.data.collections));
      }

      if (postIDsToFetch.length > 0) {
        const respPost = responses.shift();
        yield put(postsActions.fetchBlogListSuccess(respPost.data));
      }
    }

    yield put(actions.searchSuccess({ searchResults: data, searchRequest: request, filterParams, query, pageNo }));
  } catch (err) {
    const failedSearchType = yield select(searchGetSearchTypeSelector);
    if (isAgenticSearchType(failedSearchType)) {
      const currentStatus = yield select(searchGetReasoningStatusSelector);
      yield put(actions.reasoningStatusUpdate({
        ...failedReasoningStatus(currentStatus?.session_id, err, responseStatus(err)),
        searchType: failedSearchType
      }));
    }

    yield put(actions.searchFailure(
      isAgenticSearchType(failedSearchType) ? { error: err, searchType: failedSearchType } : err
    ));
  }
}

// Smart search, live: while typing, after a word is completed (space) or on a pause, parse the text
// and propose filters in the omnibox dropdown. Nothing is applied until the user picks a proposal.
const LIVE_PARSE_PAUSE_MS = 500;

function* smartLiveParse(action) {
  if (!action.payload.autocomplete) return;

  const searchType = yield select(searchGetSearchTypeSelector);
  const raw        = action.payload.query || '';
  if (isAgenticSearchType(searchType) || !raw.trim()) {
    yield put(actions.smartLiveSuccess([]));
    return;
  }

  // takeLatest: the next keystroke cancels the wait and the request.
  if (!/\s$/.test(raw)) {
    yield call(delay, LIVE_PARSE_PAUSE_MS);
  }

  try {
    const uiLang   = yield select(settingsGetUILangSelector);
    const { data } = yield call(Api.smartParse, { text: raw.trim(), uiLang });
    const current  = yield* currentSmartFilters();
    yield put(actions.smartLiveSuccess(groupSuggestions([...(data.filters || []), ...(data.suggestions || [])], current)));
  } catch {
    yield put(actions.smartLiveSuccess([]));
  }
}

// Smart search, submit: search by the current chips and text. Proposals that were not picked
// are shown over the results («Maybe …»).
export function* smartSearch() {
  const query   = ((yield select(searchGetQuerySelector)) || '').trim();
  const live    = yield select(searchGetSmartLiveSelector);
  const current = yield* currentSmartFilters();

  yield put(actions.smartParseSuccess({ meta: {}, suggestions: live }));
  yield call(applySmartFilters, current, query);
}

function* currentSmartFilters() {
  const list = yield select(state => filtersGetFiltersSelector(state, SMART_NAMESPACE));
  return list
    .filter(f => f.values?.length)
    .reduce((acc, f) => Object.assign(acc, { [f.name]: [...f.values] }), {});
}

// Chip → back to text: drop the filter and put its mention into the query.
function* smartChipToText({ payload: { name, value } }) {
  const filters = yield* currentSmartFilters();
  const meta    = yield select(searchGetSmartMetaSelector);
  const query   = (yield select(searchGetQuerySelector)) || '';
  const mention = meta[chipKey(name, value)]?.mention;

  filters[name] = (filters[name] || []).filter(v => chipKey(name, v) !== chipKey(name, value));
  yield call(applySmartFilters, filters, appendMention(query, mention));
}

// Proposal / suggestion picked: apply it as a filter (chip) and remove its mention from the text.
function* smartAcceptSuggestion({ payload: { mention, item } }) {
  const current           = yield* currentSmartFilters();
  const query             = (yield select(searchGetQuerySelector)) || '';
  const { filters, meta } = applyParsedFilters(current, [{ ...item, mention }]);

  for (const [key, m] of Object.entries(meta)) {
    yield put(actions.smartSetChipMeta({ key, meta: m }));
  }

  yield put(actions.smartRemoveSuggestion(mention));
  yield call(applySmartFilters, filters, removeMention(query, mention));
}

// Writes filters and query to redux and URL at once, then runs a single search.
export function* applySmartFilters(filters, text) {
  const router = yield select(state => state.router);

  yield put(filterActions.setHydratedFilterValues(SMART_NAMESPACE, filters));
  yield put(actions.updateQuery({ query: text, autocomplete: false }));

  if (!isSearchPath(router.location?.pathname)) {
    yield put(push({ pathname: 'search' }));
  }

  // Null every smart filter key first so removed filters disappear from the URL too.
  const cleared = Object.values(SLOT_TO_FILTER)
    .map(name => filtersTransformer.definitionsByName[name]?.queryKey)
    .filter(Boolean)
    .reduce((acc, key) => Object.assign(acc, { [key]: null }), {});
  const list    = Object.entries(filters).map(([name, values]) => ({ name, values }));
  yield* urlUpdateQuery(q => Object.assign(q, cleared, filtersTransformer.toQueryParams(list), {
    q         : text || null,
    page      : null,
    session_id: null
  }));

  yield put(actions.search({ hydrated: true, keepFilters: true }));
}

// Propagate URL search params to redux.
export function* hydrateUrl(action) {
  const router                                              = yield select(state => state.router);
  const urlQuery                                            = yield* getQuery();
  const { q, page = '1', deb = false, search_type: type } = urlQuery;

  const searchType      = isAgenticSearchType(type) ? type : SEARCH_TYPES.REGULAR;
  const isDeb           = isDebEnabled(deb);
  const pageNo          = parseInt(page, 10);
  const payload         = {
    pageNo: Number.isNaN(pageNo) ? 1 : pageNo,
    deb: isDeb,
    searchType
  };

  if (q) {
    payload.query = q;
  }

  if (urlQuery.sort_by) {
    payload.sortBy = urlQuery.sort_by;
  }

  yield put(actions.hydrateUrlSuccess(payload));

  if (!action?.payload?.searchAfterHydrate || !q || !isSearchPath(router.location?.pathname)) {
    return;
  }

  if (isAgenticSearchType(searchType)) {
    const user = yield select(authGetUserSelector);
    if (!user) {
      return;
    }

    const result = yield select(sharedReasoningResult);
    const status = yield select(sharedReasoningStatus);
    const wip = yield select(sharedReasoningWip);
    if (sameSearchQuery(result?.query, q) || (wip && sameSearchQuery(status?.query, q))) {
      return;
    }
  } else {
    const queryResult = yield select(searchGetQueryResultSelector);
    const previousSearchRequest = yield select(state => state.search.searchRequest);
    const previousQuery = yield select(searchGetPrevQuerySelector);
    if (queryResult?.search_result && (previousSearchRequest?.q === q || previousQuery === q)) {
      return;
    }
  }

  yield put(actions.search({ hydrated: true }));
}

// Update URL from query.
export function* updateUrl() {
  const urlQuery = yield* getQuery();
  const { q }    = urlQuery;

  const reduxQuery = yield select(searchGetQuerySelector);
  if (reduxQuery && reduxQuery !== q) {
    yield* urlUpdateQuery(query => Object.assign(query, { q: reduxQuery, session_id: null }));
  }
}

function* updatePageInQuery(action) {
  const page = action.payload > 1 ? action.payload : null;
  yield* urlUpdateQuery(query => Object.assign(query, { page }));
}

function* updateSortByInQuery(action) {
  const sortBy = action.payload;
  yield* urlUpdateQuery(query => Object.assign(query, { sort_by: sortBy }));
}

function* updateSearchTypeInQuery(action) {
  const searchType = isAgenticSearchType(action.payload) ? action.payload : null;
  let status = null;
  if (searchType) {
    status = yield select(sharedReasoningStatus);
  }

  yield* urlUpdateQuery(query => Object.assign(query, {
    search_type: searchType,
    page       : null,
    session_id : searchType ? status?.session_id || null : null
  }));
}

function* watchQueryUpdate() {
  yield takeEvery(types['search/updateQuery'], updateUrl);
  yield takeLatest(types['search/updateQuery'], autocomplete);
  yield takeLatest(types['search/updateQuery'], smartLiveParse);
}

function* watchSearch() {
  // TODO: Will trigger search in every such value.
  // Check that you are on search page for all, but the SEARCH action.
  yield takeLatest([
    filterTypes['filters/setFilterValue'],
    filterTypes['filters/setFilterValueMulti'],
    settingsTypes['settings/setContentLanguages'],
    types['search/search'],
    types['search/reasoningFollowup'],
    types['search/setDeb'],
    types['search/setPage'],
    types['search/setSortBy']
  ], search);
}

function* watchSmartSearch() {
  yield takeLatest(types['search/smartSearch'], smartSearch);
  yield takeLatest(types['search/smartChipToText'], smartChipToText);
  yield takeLatest(types['search/smartAcceptSuggestion'], smartAcceptSuggestion);
  yield takeLatest(types['search/smartApplyFilters'], ({ payload: { filters, text } }) => applySmartFilters(filters, text));
}

function* watchReasoningCancel() {
  yield takeLatest(types['search/reasoningCancel'], cancelReasoningSearch);
}

function* watchReasoningFinishNow() {
  yield takeLatest(types['search/reasoningFinishNow'], finishReasoningSearchNow);
}

function* watchSetPage() {
  yield takeLatest(types['search/setPage'], updatePageInQuery);
}

function* watchSetSortBy() {
  yield takeLatest(types['search/setSortBy'], updateSortByInQuery);
}

function* watchSetSearchType() {
  yield takeLatest(types['search/setSearchType'], updateSearchTypeInQuery);
}

function* watchHydrateUrl() {
  yield takeLatest(types['search/hydrateUrl'], hydrateUrl);
}

export const sagas = [
  watchHydrateUrl,
  watchQueryUpdate,
  watchSearch,
  watchSmartSearch,
  watchReasoningCancel,
  watchReasoningFinishNow,
  watchSetPage,
  watchSetSearchType,
  watchSetSortBy
];
