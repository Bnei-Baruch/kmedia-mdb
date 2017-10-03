import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/search';
import { selectors as settings } from '../redux/modules/settings';
import { actions as mdbActions } from '../redux/modules/mdb';

function* autocomplete(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const resp     = yield call(Api.autocomplete, { q: action.payload, language });
    yield put(actions.autocompleteSuccess(resp));
  } catch (err) {
    yield put(actions.autocompleteFailure(err));
  }
}

function* search(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const resp     = yield call(Api.search, { ...action.payload, language });

    if (Array.isArray(resp.hits.hits) && resp.hits.hits.length > 0) {
      // TODO edo: optimize data fetching
      // Here comes another call for all content_units we got
      // in order to fetch their possible additional collections.
      // We need this to show 'related to' second line in list.
      // This second round trip to the API is awful,
      // we should strive for a single call to the API and get all the data we need.
      // hmm, relay..., hmm ?
      const cuIDsToFetch = resp.hits.hits.reduce((acc, val) => {
          return acc.concat(val._source.mdb_uid);
      }, []);
      const language     = yield select(state => settings.getLanguage(state.settings));
      const pageSize     = cuIDsToFetch.length;
      const resp2        = yield call(Api.units, { id: cuIDsToFetch, pageSize, language });
      yield put(mdbActions.receiveContentUnits(resp2.content_units));
    }

    yield put(actions.searchSuccess(resp));
  } catch (err) {
    yield put(actions.searchFailure(err));
  }
}

function* watchAutocomplete() {
  yield takeLatest(types.AUTOCOMPLETE, autocomplete);
}

function* watchSearch() {
  yield takeLatest(types.SEARCH, search);
}

export const sagas = [
  watchAutocomplete,
  watchSearch,
];
