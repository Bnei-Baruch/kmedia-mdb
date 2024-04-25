import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { getQuery, updateQuery as urlUpdateQuery } from './helpers/url';
import { GenerateSearchId } from '../helpers/search';
import { actions, selectors, types } from '../redux/modules/search';
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
  searchGetSortBySelector,
  settingsGetContentLanguagesSelector,
  settingsGetUILangSelector
} from '../redux/selectors';

// TODO: Use debounce after redux-saga updated.
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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

    const uiLang           = yield select(settingsGetUILangSelector);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const sortBy           = yield select(searchGetSortBySelector);
    const deb              = yield select(searchGetDebSelector);

    // Redirect from home page.
    if (action && action.type === types['search/search'] && !action.payload) {
      yield put(push({ pathname: 'search' }));
      yield* urlUpdateQuery(q => Object.assign(q, { q: query }));
    }

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
      deb,
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
    yield put(actions.searchFailure(err));
  }
}

// Propagate URL search params to redux.
export function* hydrateUrl() {
  const urlQuery                       = yield* getQuery();
  const { q, page = '1', deb = false } = urlQuery;

  const reduxQuery  = yield select(searchGetQuerySelector);
  const reduxPageNo = yield select(searchGetPageNoSelector);
  const reduxDeb    = yield select(searchGetDebSelector);
  if (deb !== reduxDeb) {
    yield put(actions.setDeb(deb));
  }

  if (q) {
    if (q !== reduxQuery) {
      yield put(actions.updateQuery({ query: q, autocomplete: false }));
    }

    if (urlQuery.sort_by) {
      yield put(actions.setSortBy(urlQuery.sort_by));
    }

    const pageNo = parseInt(page, 10);
    if (reduxPageNo !== pageNo) {
      yield put(actions.setPage(pageNo));
    }
  }
}

// Update URL from query.
export function* updateUrl(action) {
  const urlQuery = yield* getQuery();
  const { q }    = urlQuery;

  const reduxQuery = yield select(searchGetQuerySelector);
  if (reduxQuery && reduxQuery !== q) {
    yield* urlUpdateQuery(query => Object.assign(query, { q: reduxQuery }));
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
    types['search/setDeb'],
    types['search/setPage'],
    types['search/setSortBy']
  ], search);
}

function* watchSetPage() {
  yield takeLatest(types['search/setPage'], updatePageInQuery);
}

function* watchSetSortBy() {
  yield takeLatest(types['search/setSortBy'], updateSortByInQuery);
}

function* watchHydrateUrl() {
  yield takeLatest(types['search/hydrateUrl'], hydrateUrl);
}

export const sagas = [
  watchHydrateUrl,
  watchQueryUpdate,
  watchSearch,
  watchSetPage,
  watchSetSortBy
];
