import { put, takeLatest } from 'redux-saga/effects';

import { RTL_LANGUAGES } from '../helpers/consts';
import { changeDirection, getCurrentDirection } from '../helpers/i18n-utils';
import { types } from '../redux/modules/settings';
import { actions as sources } from '../redux/modules/sources';
import { actions as tags } from '../redux/modules/tags';
import i18n from '../i18n';

function* setLanguage(action) {
  const language = action.payload;

  // TODO (edo): promisify callback and check for errors
  i18n.changeLanguage(language);

  yield put(sources.fetchSources());
  yield put(tags.fetchTags());
  yield changeDirectionIfNeeded(language);
}

function* changeDirectionIfNeeded(language) {
  const currentDirection = getCurrentDirection() || 'ltr';
  const newDirection     = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

  if (currentDirection !== newDirection) {
    console.log('changeDirectionIfNeeded: ', language, newDirection);
    changeDirection(newDirection);
  }
}

function* watchSetLanguages() {
  yield takeLatest([types.SET_LANGUAGE], setLanguage);
}

export const sagas = [
  watchSetLanguages,
];
