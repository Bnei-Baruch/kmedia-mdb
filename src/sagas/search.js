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
import { fetchAllSeries } from './lessons';
import { fetchViewsByUIDs } from './recommended';
import { filtersTransformer } from '../filters';
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
  searchGetReasoningResultSelector,
  searchGetReasoningStatusSelector,
  searchGetSearchTypeSelector,
  searchGetSortBySelector,
  settingsGetContentLanguagesSelector,
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
const reasoningStatusForType = (state, searchType) => state.search.reasoningByType?.[searchType]?.status;
const reasoningResultForType = (state, searchType) => state.search.reasoningByType?.[searchType]?.result;
const reasoningWipForType = (state, searchType) => !!state.search.reasoningByType?.[searchType]?.wip;
const isConnectionRefused = err => err?.code === 'ERR_CONNECTION_REFUSED' || err?.message?.includes('ERR_CONNECTION_REFUSED');
const responseStatus = value => value?.http_status || value?.status || value?.response?.status;
const isNotFound = value => responseStatus(value) === 404;
const combineFollowupQuery = (originalQuery, followupQuery) => [originalQuery, followupQuery].filter(Boolean).join('; ');
const sameSearchQuery = (a, b) => (a || '').trim() === (b || '').trim();
const arrayEquals = (a, b) => (
  Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((value, index) => value === b[index])
);
const sameRegularSearchRequest = (a, b) => !!a && !!b
  && a.q === b.q
  && a.sortBy === b.sortBy
  && a.ui_language === b.ui_language
  && arrayEquals(a.content_languages, b.content_languages)
  && a.deb === b.deb
  && a.pageNo === b.pageNo
  && a.pageSize === b.pageSize;

const isSearchPath = pathname => /(^|\/)search\/?$/.test(pathname || '');

const reasoningErrorMessage = err => {
  if (isConnectionRefused(err)) {
    return connectionRefusedMessage;
  }

  return err?.response?.data?.error || err?.message || 'Reasoning search failed';
};

const failedReasoningStatus = (sessionId, message, httpStatus) => ({
  session_id: sessionId,
  state     : 'failed',
  phase     : 'error',
  done      : true,
  http_status: httpStatus,
  message
});

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
        response.data?.error || response.statusText || 'Reasoning search failed',
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

function* recoverFollowupRequest(originalQuery, followupQuery, uiLang, deb, isRapid) {
  let cacheData = null;
  try {
    const cacheResponse = yield call(Api.reasoningSearchCache, {
      q          : originalQuery,
      ui_language: uiLang,
      is_rapid   : isRapid
    });
    cacheData = cacheResponse?.data;
  } catch (_) {
    cacheData = null;
  }

  if (cacheData?.cache_hit && cacheData.session_id) {
    return {
      keepResult: true,
      resultQuery: originalQuery,
      request   : {
        q          : followupQuery,
        session_id : cacheData.session_id,
        ui_language: uiLang,
        deb        : isDebEnabled(deb),
        is_rapid   : isRapid
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
      is_rapid   : isRapid
    }
  };
}

function* pollReasoningStatus(sessionId, searchType) {
  let polling = true;
  let finalStatus = null;

  while (polling) {
    const currentStatus = yield select(state => reasoningStatusForType(state, searchType));
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
      const nextStatus = yield select(state => reasoningStatusForType(state, searchType));
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
  const currentStatus = yield select(state => reasoningStatusForType(state, searchType));
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

  const nextStatus = yield select(state => reasoningStatusForType(state, searchType));
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

  const currentResult = yield select(state => reasoningResultForType(state, searchType));
  const wip = yield select(state => reasoningWipForType(state, searchType));
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
    const currentStatus = yield select(state => reasoningStatusForType(state, searchType));
    if (isAgenticSearchType(searchType) && currentStatus?.session_id === sessionId) {
      yield put(actions.reasoningStatusUpdate({ ...failedReasoningStatus(sessionId, reasoningErrorMessage(err)), searchType }));
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
    yield put(actions.reasoningStatusUpdate({ ...failedReasoningStatus(sessionId, reasoningErrorMessage(err)), searchType }));
    yield put(actions.searchFailure({ error: err, searchType }));
  }
}

function* finishReasoningSearchNow() {
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
    const query = reasoningResult?.query || (yield select(searchGetQuerySelector));
    yield call(fetchReasoningResult, sessionId, query, searchType);
  } catch (err) {
    yield put(actions.reasoningStatusUpdate({ ...failedReasoningStatus(sessionId, reasoningErrorMessage(err), responseStatus(err)), searchType }));
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
    const isSearchTypeChange = action && action.type === types['search/setSearchType'];
    const urlQuery   = yield* getQuery();

    // Redirect from home page.
    if (action && action.type === types['search/search'] && !action.payload) {
      yield put(push({ pathname: 'search' }));
      yield* urlUpdateQuery(q => Object.assign(q, { q: query }));
    }

    if (isAgenticSearchType(searchType)) {
      const user = yield select(authGetUserSelector);
      if (!user) {
        yield put(actions.searchFailure({ error: null, searchType }));
        return;
      }

      const previousReasoningResult = yield select(searchGetReasoningResultSelector);
      const previousReasoningStatus = yield select(searchGetReasoningStatusSelector);
      const sessionIdFromPrevious   = previousReasoningResult?.session_id;
      const runningSessionId        = !reasoningStatusTerminal(previousReasoningStatus) ? previousReasoningStatus?.session_id : null;
      const restoreSessionId        = !isExplicitSearch && !isFollowup && urlQuery.search_type === searchType ? urlQuery.session_id : null;
      const originalQuery           = previousReasoningResult?.query || query?.trim();
      const q                       = isFollowup ? action.payload?.query?.trim() : query?.trim();
      let request                   = {
        q,
        session_id : isFollowup ? sessionIdFromPrevious : undefined,
        cancel_session_id: !isFollowup && !restoreSessionId ? runningSessionId : undefined,
        ui_language: uiLang,
        deb        : isDebEnabled(deb),
        is_rapid   : reasoningSearchIsRapid(searchType)
      };
      let resultQuery               = isFollowup ? originalQuery : query;
      if (!q) {
        yield put(actions.searchFailure(null));
        return;
      }

      if (
        isSearchTypeChange
        && (
          sameSearchQuery(previousReasoningResult?.query, query)
          || sameSearchQuery(previousReasoningStatus?.query, query)
        )
      ) {
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
        const recovery = yield call(recoverFollowupRequest, originalQuery, q, uiLang, deb, reasoningSearchIsRapid(searchType));
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

    // Clear pagination and filters.
    if (prevQuery !== '' && prevQuery !== query && (pageNo !== 1 || !!filterParams)) {
      if (pageNo !== 1) {
        yield* urlUpdateQuery(query => Object.assign(query, { page: 1 }));
        pageNo = 1;
      }

      if (!!filterParams) {
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

    const queryResult = yield select(searchGetQueryResultSelector);
    const previousSearchRequest = yield select(state => state.search.searchRequest);
    if (isSearchTypeChange && queryResult?.search_result && sameRegularSearchRequest(previousSearchRequest, request)) {
      return;
    }

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
      yield put(actions.reasoningStatusUpdate({
        state  : 'failed',
        phase  : 'error',
        done   : true,
        message: reasoningErrorMessage(err),
        searchType: failedSearchType
      }));
    }

    yield put(actions.searchFailure(
      isAgenticSearchType(failedSearchType) ? { error: err, searchType: failedSearchType } : err
    ));
  }
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

    const result = yield select(state => reasoningResultForType(state, searchType));
    const status = yield select(state => reasoningStatusForType(state, searchType));
    const wip = yield select(state => reasoningWipForType(state, searchType));
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
export function* updateUrl(action) {
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
    status = yield select(state => reasoningStatusForType(state, searchType));
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
    types['search/setSearchType'],
    types['search/setDeb'],
    types['search/setPage'],
    types['search/setSortBy']
  ], search);
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
  watchReasoningCancel,
  watchReasoningFinishNow,
  watchSetPage,
  watchSetSearchType,
  watchSetSortBy
];
