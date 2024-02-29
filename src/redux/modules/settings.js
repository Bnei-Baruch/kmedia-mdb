import { createSlice } from '@reduxjs/toolkit';

import {
  ALL_LANGUAGES,
  COOKIE_CONTENT_LANGS,
  COOKIE_SHOW_ALL_CONTENT,
  COOKIE_UI_LANG,
  DEFAULT_CONTENT_LANGUAGES,
  DEFAULT_UI_LANGUAGE,
  DEFAULT_UI_DIR
} from '../../helpers/consts';
import { getLanguageDirection } from '../../helpers/i18n-utils';
import { setCookie } from '../../helpers/date';

export const initialState = {
  // Array is required for url language because we have to return
  // the same array for contentLanguages without generating a new
  // one each time. Otherwise, the component will re-render infinitely.
  urlLanguage     : [],
  uiLang          : DEFAULT_UI_LANGUAGE,
  uiDir           : DEFAULT_UI_DIR,
  contentLanguages: DEFAULT_CONTENT_LANGUAGES,
  showAllContent  : false,
  pageSize        : 20
};

export const onSetUrlLanguage = (state, payload) => {
  if (payload) {
    state.urlLanguage = [payload];
  } else if (state.urlLanguage.length > 0) {
    state.urlLanguage.length = 0;
  }
};

export const onSetUILanguage = (state, payload) => {
  setCookie(COOKIE_UI_LANG, payload.uiLang);
  state.uiLang = payload.uiLang;
  state.uiDir  = getLanguageDirection(payload.uiLang);
};

export const onSetContentLanguages = (state, payload) => {
  setCookie(COOKIE_CONTENT_LANGS, payload.contentLanguages);
  state.contentLanguages = payload.contentLanguages;
};

const onSetShowAllContent = (state, payload) => {
  setCookie(COOKIE_SHOW_ALL_CONTENT, payload);
  state.showAllContent = payload;
};

const onSetPageSize = (state, payload) => {
  state.pageSize = payload;
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,

  reducers: {
    setURLLanguage     : (state, { payload }) => void onSetUrlLanguage(state, payload),
    setUILanguage      : (state, { payload }) => void (onSetUILanguage(state, payload)),
    setContentLanguages: (state, { payload }) => void (onSetContentLanguages(state, payload)),
    setShowAllContent  : (state, { payload }) => void (onSetShowAllContent(state, payload)),
    setPageSize        : (state, { payload }) => void (onSetPageSize(state, payload))
  },

  selectors: {
    getUrlLang         : state => (state.urlLanguage.length && state.urlLanguage[0]) || '',
    getUIDir           : state => !!state.urlLanguage.length ? getLanguageDirection(state.urlLanguage[0]) : state.uiDir,
    getUILang          : (state, skipUrl) => !state.urlLanguage.length || skipUrl ? state.uiLang : state.urlLanguage[0],
    getShowAllContent  : state => state.showAllContent,
    getPageSize        : state => state.pageSize,
    getContentLanguages: (state, skipFlags) => {
      if (state.urlLanguage.length && !skipFlags) {
        return state.urlLanguage;
      }

      if (state.showAllContent && !skipFlags) {
        return ALL_LANGUAGES;
      }

      return state.contentLanguages;
    }
  }
});

export default settingsSlice.reducer;

export const { actions } = settingsSlice;

export const types = Object.fromEntries(new Map(
  Object.values(settingsSlice.actions).map(a => [a.type, a.type])
));

export const selectors = settingsSlice.getSelectors();
