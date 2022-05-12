import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import Api from '../helpers/Api';
import { getQuery, updateQuery as urlUpdateQuery } from './helpers/url';
import { GenerateSearchId } from '../helpers/search';
import { actions, selectors, types } from '../redux/modules/search';
import { selectors as settings } from '../redux/modules/settings';
import { actions as mdbActions } from '../redux/modules/mdb';
import { actions as postsActions } from '../redux/modules/publications';
import { selectors as filterSelectors, types as filterTypes } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';

// TODO: Use debounce after redux-saga updated.
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function* autocomplete(action) {
  try {
    if (!action.payload.autocomplete) {
      yield put(actions.autocompleteSuccess({ suggestions: []/*, request*/ }));
      return;
    }

    yield delay(100);  // Debounce autocomplete.
    const query    = yield select(state => selectors.getQuery(state.search));
    const language = yield select(state => settings.getLanguage(state.settings));
    const autocompleteId = GenerateSearchId();
    const request = { q: query, language };
    let suggestions = null;
    if (query) {
      const { data } = yield call(Api.autocomplete, request);
      data.autocompleteId = autocompleteId;
      suggestions = data;
    }

    yield put(actions.autocompleteSuccess({ suggestions/*, request*/ }));
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
    // Prepare filters values.
    const filters         = yield select(state => filterSelectors.getFilters(state.filters, 'search'));
    const params          = filtersTransformer.toApiParams(filters);
    const filterKeyValues = Object.entries(params).map(([v, k]) => `${v}:${k}`).join(' ');
    const filterParams    = filterKeyValues ? ` ${filterKeyValues}` : '';

    if (action.type === filterTypes.SET_FILTER_VALUE_MULTI) {
      const prevFilterParams = yield select(state => selectors.getPrevFilterParams(state.search));
      if (filterParams === prevFilterParams) {
        // Don't search if filters have not changed.
        return;
      }
    }

    const query    = yield select(state => selectors.getQuery(state.search));
    const language = yield select(state => settings.getLanguage(state.settings));
    const sortBy   = yield select(state => selectors.getSortBy(state.search));
    const deb      = yield select(state => selectors.getDeb(state.search));
    const pageNo   = yield select(state => selectors.getPageNo(state.search));

    // Redirect from home page.
    if (action.type === types.SEARCH && !action.payload) {
      yield put(push({ pathname: 'search' }));
      yield* urlUpdateQuery(q => Object.assign(q, { q: query }));
    }

    const q = query.trim() ? `${query.trim()}${filterParams}` : filterParams;
    if (!q) {
      // If no query nor filters, silently fail the request, don't sent request to backend.
      yield put(actions.searchFailure(null));
      return;
    }

    const searchId = GenerateSearchId();
    const request  = {
      q,
      sortBy,
      language,
      deb,
      searchId,
      pageNo,
      pageSize: 20,
    };

    yield put(actions.setWip());
    const { data } = yield call(Api.search, request);

    data.search_result.searchId = searchId;

    if (Array.isArray(data.search_result.hits.hits) && data.search_result.hits.hits.length > 0) {
      // TODO edo: optimize data fetching
      // Server should return associated items (collections, units, posts...) together with search results
      // hmm, relay..., hmm ?
      const cIDsToFetch    = getIdsForFetch(data.search_result.hits.hits, ['collections']);
      const cuIDsToFetch   = getIdsForFetch(data.search_result.hits.hits, ['units', 'sources']);
      const postIDsToFetch = getIdsForFetch(data.search_result.hits.hits, ['posts']);

      if (cuIDsToFetch.length === 0 && cIDsToFetch.length === 0 && postIDsToFetch.length === 0) {
        yield put(actions.searchSuccess({ searchResults: data, searchRequest: request }));
        return;
      }

      const lang     = yield select(state => settings.getLanguage(state.settings));
      const requests = [];
      if (cuIDsToFetch.length > 0) {
        requests.push(call(Api.units, {
          id: cuIDsToFetch,
          pageSize: cuIDsToFetch.length,
          language: lang,
          with_files: true,
          with_derivations: true,
        }));
      }

      if (cIDsToFetch.length > 0) {
        requests.push(call(Api.collections, { id: cIDsToFetch, pageSize: cIDsToFetch.length, language: lang }));
      }

      if (postIDsToFetch.length > 0) {
        requests.push(call(Api.posts, { id: postIDsToFetch, pageSize: postIDsToFetch.length, language: lang }));
      }

      const responses = yield all(requests);
      if (cuIDsToFetch.length > 0) {
        const respCU = responses.shift();
        yield put(mdbActions.receiveContentUnits(respCU.data.content_units));
      }

      if (cIDsToFetch.length > 0) {
        const respC = responses.shift();
        yield put(mdbActions.receiveCollections(respC.data.collections));
      }

      if (postIDsToFetch.length > 0) {
        const respPost = responses.shift();
        yield put(postsActions.fetchBlogListSuccess(respPost.data));
      }
    }

    yield put(actions.searchSuccess({ searchResults: data, searchRequest: request, filterParams }));
  } catch (err) {
    yield put(actions.searchFailure(err));
  }
}

// Propogate URL search params to redux.
export function* hydrateUrl() {
  const urlQuery = yield* getQuery();
  const { q, page = '1', deb = false } = urlQuery;

  const reduxQuery  = yield select(state => selectors.getQuery(state.search));
  const reduxPageNo = yield select(state => selectors.getPageNo(state.search));
  const reduxDeb    = yield select(state => selectors.getDeb(state.search));
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
  const { q } = urlQuery;

  const reduxQuery = yield select(state => selectors.getQuery(state.search));
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
  yield takeEvery(types.UPDATE_QUERY, updateUrl);
  yield takeLatest(types.UPDATE_QUERY, autocomplete);
}

function* watchSearch() {
  yield takeLatest([
    types.SEARCH,
    types.SET_SORT_BY,
    types.SET_PAGE,
    types.SET_DEB,
    filterTypes.SET_FILTER_VALUE,
    filterTypes.SET_FILTER_VALUE_MULTI,
  ], search);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

function* watchSetSortBy() {
  yield takeLatest(types.SET_SORT_BY, updateSortByInQuery);
}

function* watchHydrateUrl() {
  yield takeLatest(types.HYDRATE_URL, hydrateUrl);
}

export const sagas = [
  watchHydrateUrl,
  watchQueryUpdate,
  watchSearch,
  watchSetPage,
  watchSetSortBy,
];
