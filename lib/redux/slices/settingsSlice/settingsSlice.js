import {
  ALL_LANGUAGES,
  COOKIE_CONTENT_LANGS,
  COOKIE_SHOW_ALL_CONTENT,
  COOKIE_UI_LANG,
  DEFAULT_CONTENT_LANGUAGES,
  DEFAULT_UI_LANGUAGE,
  DEFAULT_UI_DIR,
} from '@/src/helpers/consts';
import { getLanguageDirection } from '@/src/helpers/i18n-utils';
import { setCookie } from '@/src/helpers/date';
import { createSlice } from '@reduxjs/toolkit';
// import { getQuery } from '../../helpers/url';

/* Reducer */
const initialState = {
  // Array is required for url language because we have to return
  // the same array for contentLanguages without generating a new
  // one each time. Otherwise the component will re-render infinitly.
  urlLanguage: [],
  uiLang: DEFAULT_UI_LANGUAGE,
  uiDir: DEFAULT_UI_DIR,
  contentLanguages: DEFAULT_CONTENT_LANGUAGES,
  showAllContent: false,
  pageSize: 20,

  //hideUILanguages: DEFAULT_LANGUAGES,
  //hideUILangContent: false,
};

const onSetUrlLanguage = (draft, payload) => {
  // console.log('onSetUrlLanguage', draft.urlLanguage, payload);
  if (payload) {
    draft.urlLanguage = [payload];
  } else if (draft.urlLanguage.length > 0) {
    draft.urlLanguage.length = 0;
  }
};

const onSetUILanguage = (draft, payload) => {
  setCookie(COOKIE_UI_LANG, payload.uiLang);
  draft.uiLang = payload.uiLang;
  draft.uiDir  = getLanguageDirection(payload.uiLang);
};

const onSetContentLanguages = (draft, payload) => {
  setCookie(COOKIE_CONTENT_LANGS, payload.contentLanguages);
  draft.contentLanguages = payload.contentLanguages;
};

/*
export const onSetLanguages = (draft, payload) => {
  // console.log('onSetLanguages', payload.languages, Array.from(draft.languages));
  setCookie(COOKIE_UI_LANG, payload.languages[0]);
  setCookie(COOKIE_CONTENT_LANGS, payload.languages);
  draft.languages = payload.languages;
  //draft.hideUILanguages = payload.languages.slice(1);
  draft.uiDir = getLanguageDirection(payload.languages[0])
}
*/

const onSetShowAllContent = (draft, payload) => {
  draft.showAllContent = payload;
  setCookie(COOKIE_SHOW_ALL_CONTENT, payload);
};

/*const onSetHideUILangContent = (draft, payload) => {
  draft.hideUILangContent = payload;
  setCookie(COOKIE_HIDE_UI_LANG_CONTENT, payload);
}*/

const onSetPageSize = (draft, payload) => {
  draft.pageSize = payload;
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUrlLanguage: onSetUrlLanguage,
    setUILanguage: onSetUILanguage,
    setContentLanguages: onSetContentLanguages,
    setShowAllContent: onSetShowAllContent,
    setPageSize: onSetPageSize
  }
});

/* Selectors */
const getUrlLang          = state => (state.urlLanguage.length && state.urlLanguage[0]) || '';
const getUIDir            = state => !!state.urlLanguage.length ? getLanguageDirection(state.urlLanguage[0]) : state.uiDir;
const getUILang           = state => !state.urlLanguage.length || skipUrl ? state.uiLang : state.urlLanguage[0];
const getContentLanguages = (state, skipFlags) => {
  if (state.urlLanguage.length && !skipFlags) {
    return state.urlLanguage;
  }

  if (state.showAllContent && !skipFlags) {
    return ALL_LANGUAGES;
  }

  /*
  if (state.hideUILangContent && state.languages.length > 1 && !skipFlags) {
    return state.hideUILanguages;
  }
  */

  return state.contentLanguages;
};

const getShowAllContent = state => state.showAllContent;
const getPageSize       = state => state.pageSize;
//const getHideUILangContent = state => state.hideUILangContent;

export const selectors = {
  getUrlLang,
  getUIDir,
  getUILang,
  getContentLanguages,
  getShowAllContent,
  //getHideUILangContent,
  getPageSize,
};
