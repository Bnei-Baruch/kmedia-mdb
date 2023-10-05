import { put, select, takeLatest } from 'redux-saga/effects';
import moment from 'moment';

import { LANG_UKRAINIAN } from '../helpers/consts';
import { changeDirection, getCurrentDirection, getLanguageDirection } from '../helpers/i18n-utils';
import { selectors as settings, types } from '../redux/modules/settings';
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
  const uiLang = yield select(state => settings.getUILang(state.settings));
  const newUILang = (action.type === types.SET_URL_LANGUAGE ? action.payload : action.payload.uiLang) || uiLang;

  i18n.changeLanguage(newUILang, err => {
    if (err) {
      console.log(`Error switching to ${newUILang}: ${err}`);
    }
  });

  // Change global moment.js locale
  const newUILangUKFix = newUILang === LANG_UKRAINIAN ? 'uk' : newUILang;
  moment.locale(newUILangUKFix);

  // Change page direction and fetch css
  changeDirectionIfNeeded(newUILang);

  // Reload sources tags and more to match required languages.
  yield put(mdb.fetchSQData());
}

function* watchSetLanguages() {
  yield takeLatest([types.SET_UI_LANGUAGE, types.SET_URL_LANGUAGE], setLanguages);
}

export const sagas = [
  watchSetLanguages,
];
