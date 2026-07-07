import { setDayjsLocale } from '../helpers/dayjs';
import { put, select, takeLatest } from 'redux-saga/effects';

import { changeDirection, getCurrentDirection, getLanguageDirection } from '../helpers/i18n-utils';
import i18n from '../helpers/i18nnext';
import { actions as mbdActions } from '../redux/modules/mdb';
import { types } from '../redux/modules/settings';
import { settingsGetUILangSelector } from '../redux/selectors';

function changeDirectionIfNeeded(language) {
  const currentDirection = getCurrentDirection() || 'ltr';
  const newDirection = getLanguageDirection(language);

  if (currentDirection !== newDirection) {
    changeDirection(newDirection);
  }
}

function* setLanguages(action) {
  const uiLang = yield select(settingsGetUILangSelector);
  const newUILang =
    (action.type === types['settings/setURLLanguage'] ? action.payload : action.payload.uiLang) || uiLang;

  console.log('[settings/setLanguages]', { type: action.type, payload: action.payload, effectiveUiLang: uiLang, newUILang });

  if (typeof window !== 'undefined') {
    i18n.changeLanguage(newUILang, err => {
      if (err) {
        console.log(`Error switching to ${newUILang}: ${err}`);
      }
    });
  }

  setDayjsLocale(newUILang);

  // Change page direction and fetch css
  changeDirectionIfNeeded(newUILang);

  // Reload sources/tags to match the new language. On SSR this is run + awaited
  // explicitly in rendererUtils (so it lands in window.__data); only the client
  // needs the watcher here — avoids a duplicate fetchSQData during SSR.
  if (typeof window !== 'undefined') {
    yield put(mbdActions.fetchSQData());
  }
}

function* watchSetLanguages() {
  yield takeLatest([types['settings/setUILanguage'], types['settings/setURLLanguage']], setLanguages);
}

export const sagas = [watchSetLanguages];
