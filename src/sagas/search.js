import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { getQuery, updateQuery as urlUpdateQuery } from './helpers/url';
import { GenerateSearchId } from '../helpers/search';
import { actions, selectors, types } from '../redux/modules/search';
import { selectors as settings } from '../redux/modules/settings';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';

function* autocomplete(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.autocomplete, { q: action.payload, language });
    yield put(actions.autocompleteSuccess(data));
  } catch (err) {
    yield put(actions.autocompleteFailure(err));
  }
}

export function* search(action) {
  try {
    yield* urlUpdateQuery(query => Object.assign(query, { q: action.payload.q }));

    const language = yield select(state => settings.getLanguage(state.settings));
    const sortBy   = yield select(state => selectors.getSortBy(state.search));
    const deb      = yield select(state => selectors.getDeb(state.search));

    // Prepare filters values.
    const filters = yield select(state => filterSelectors.getFilters(state.filters, 'search'));
    const params  = filtersTransformer.toApiParams(filters);
    const filterKeyValues = Object.entries(params).map(([v, k]) => `${v}:${k}`).join(' ');
    const filterParams = filterKeyValues ? ` ${filterKeyValues}` : '';

    const q = action.payload.q.trim() ? `${action.payload.q.trim()}${filterParams}` : filterParams;
    if (!q) {
      // If no query nor filters, silently fail the request, don't sent request to backend.
      yield put(actions.searchFailure(null));
      return
    }
    const searchId = GenerateSearchId();
    const { data } = yield call(Api.search, { ...action.payload, q, sortBy, language, deb, searchId });
    data.searchId = searchId;

    if (Array.isArray(data.hits.hits) && data.hits.hits.length > 0) {
      // TODO edo: optimize data fetching
      // Here comes another call for all content_units we got
      // in order to fetch their possible additional collections.
      // We need this to show 'related to' second line in list.
      // This second round trip to the API is awful,
      // we should strive for a single call to the API and get all the data we need.
      // hmm, relay..., hmm ?
      const cIDsToFetch = data.hits.hits.reduce((acc, val) => {
        if (val._type === 'collections') {
          return acc.concat(val._source.mdb_uid);
        } else {
          return acc;
        }
      }, []);
      const cuIDsToFetch = data.hits.hits.reduce((acc, val) => {
        if (val._type === 'content_units') {
          return acc.concat(val._source.mdb_uid);
        } else {
          return acc;
        }
      }, []);
      const sIDsToFetch = data.hits.hits.reduce((acc, val) => {
        if (val._type === 'sources') {
          return acc.concat(val._source.mdb_uid);
        } else {
          return acc;
        }
      }, []);
      const language     = yield select(state => settings.getLanguage(state.settings));
      const respCU       = yield call(Api.units, { id: cuIDsToFetch, pageSize: cuIDsToFetch.length, language });
      const respC        = yield call(Api.collections, { id: cIDsToFetch, pageSize: cIDsToFetch.length, language });
      const respS        = yield call(Api.sources, { id: sIDsToFetch, pageSize: sIDsToFetch.length, language  })
      yield put(mdbActions.receiveContentUnits(respCU.data.content_units));
      yield put(mdbActions.receiveCollections(respC.data.collections));
      yield put(mdbActions.receiveSources(respS.data));
    }

    yield put(actions.searchSuccess(data));
  } catch (err) {
    yield put(actions.searchFailure(err));
  }
}

function* click(action) {
  yield call(Api.click, action.payload);
}

function* updatePageInQuery(action) {
  const page = action.payload > 1 ? action.payload : null;
  yield* urlUpdateQuery(query => Object.assign(query, { page }));
}

function* updateSortByInQuery(action) {
  const sortBy = action.payload;
  yield* urlUpdateQuery(query => Object.assign(query, { sort_by: sortBy }));
}

export function* hydrateUrl() {
  const query             = yield* getQuery();
  const { q, page = '1', deb = false } = query;

  yield put(actions.setDeb(deb));

  if (q) {
    yield put(actions.updateQuery(q));

    if (query.sort_by) {
      yield put(actions.setSortBy(query.sort_by));
    }

    const pageNo = parseInt(page, 10);
    yield put(actions.setPage(pageNo));
  }
}

function* watchAutocomplete() {
  yield takeLatest(types.AUTOCOMPLETE, autocomplete);
}

function* watchSearch() {
  yield takeLatest(types.SEARCH, search);
}

function* watchClick() {
  yield takeEvery(types.CLICK, click);
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
  watchAutocomplete,
  watchSearch,
  watchClick,
  watchSetPage,
  watchSetSortBy,
  watchHydrateUrl,
];
