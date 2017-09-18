import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/search';
import { selectors as settings } from '../redux/modules/settings';

function* autocomplete(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const resp     = yield call(Api.autocomplete, { q: action.payload, language });
    yield put(actions.autocompleteSuccess(resp));
  } catch (err) {
    yield put(actions.autocompleteFailure(err));
  }
}

function* watchAutocomplete() {
  yield takeLatest(types.AUTOCOMPLETE, autocomplete);
}

export const sagas = [
  watchAutocomplete,
];
