import { takeLatest } from 'redux-saga/effects';

import { types } from '../redux/modules/settings';
import i18n from '../i18n';

function* setLanguage(lang) {
  i18n.changeLanguage(lang);
}

function* watchSetLanguages() {
  yield takeLatest([types.SET_LANGUAGE], setLanguage);
}

export const sagas = [
  watchSetLanguages,
];
