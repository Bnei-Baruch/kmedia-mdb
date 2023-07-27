import { put, takeLatest } from 'redux-saga/effects';
import moment from 'moment';

import { LANG_UKRAINIAN } from '../helpers/consts';
import { changeDirection, getCurrentDirection, getLanguageDirection } from '../helpers/i18n-utils';
import { types } from '../redux/modules/settings';
import { actions as mdb } from '../redux/modules/mdb';
import i18n from '../helpers/i18nnext';

function changeDirectionIfNeeded(language) {
  const currentDirection = getCurrentDirection() || 'ltr';
  const newDirection     = getLanguageDirection(language);

  if (currentDirection !== newDirection) {
    changeDirection(newDirection);
  }
}

function* setLanguages(action) {
  const newUILang = action.type === types.SET_URL_LANGUAGE ? action.payload : action.payload.uiLang;

  console.log('switching languages', newUILang);
  i18n.changeLanguage(newUILang, err => {
    if (err) {
      console.log(`Error switching to ${newUILang}: ${err}`);
    }
  });

  // Change global moment.js locale
  moment.locale(newUILang === LANG_UKRAINIAN ? 'uk' : newUILang);

  // Change page direction and fetch css
  changeDirectionIfNeeded(newUILang);

  // Reload sources tags and more to match required languages.
  console.log('setLanguages fetchSQData');
  yield put(mdb.fetchSQData());
}

function* watchSetLanguages() {
  yield takeLatest([types.SET_UI_LANGUAGE, types.SET_URL_LANGUAGE], setLanguages);
}

export const sagas = [
  watchSetLanguages,
];
