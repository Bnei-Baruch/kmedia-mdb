import { put, takeLatest } from 'redux-saga/effects';

import { types } from '../redux/modules/settings';
import { actions as sources } from '../redux/modules/sources';
import { actions as tags } from '../redux/modules/tags';
import i18n from '../i18n';

function* setLanguage(action) {
  // TODO (edo): promisify callback and check for errors
  i18n.changeLanguage(action.payload);
  yield put(sources.fetchSources());
  yield put(tags.fetchTags());
}

function* watchSetLanguages() {
  yield takeLatest([types.SET_LANGUAGE], setLanguage);
}

export const sagas = [
  watchSetLanguages,
];
