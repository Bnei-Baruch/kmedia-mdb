import { createAction } from 'redux-actions';
import produce, { setAutoFreeze } from 'immer';

import {
  ALL_LANGUAGES,
  COOKIE_CONTENT_LANGS,
  //COOKIE_HIDE_UI_LANG_CONTENT,
  COOKIE_SHOW_ALL_CONTENT,
  COOKIE_UI_LANG,
  DEFAULT_CONTENT_LANGUAGES,
  DEFAULT_UI_LANGUAGE,
  DEFAULT_UI_DIR,
} from '../../helpers/consts';
import { getLanguageDirection } from '../../helpers/i18n-utils';
import { setCookie } from '../../helpers/date';
// import { getQuery } from '../../helpers/url';

setAutoFreeze(process.env.NODE_ENV !== 'production')

/* Helpers */

export const handleActions = (actionsMap, defaultState) =>
  (
    state = defaultState,
    { type, payload }
  ) =>
    produce(state, draft => {
      const action = actionsMap[type];
      action && action(draft, payload, type);
    });

/* Types */

const SET_UI_LANGUAGE          = 'Settings/SET_UI_LANGUAGE';
const SET_CONTENT_LANGUAGES    = 'Settings/SET_CONTENT_LANGUAGES';
const SET_URL_LANGUAGE         = 'Settings/SET_URL_LANGUAGE';
const SET_SHOW_ALL_CONTENT     = 'Settings/SET_SHOW_ALL_CONTENT';
//const SET_LANGUAGES            = 'Settings/SET_LANGUAGES';
//const SET_HIDE_UI_LANG_CONTENT = 'Settings/SET_HIDE_UI_LANG_CONTENT';
const SET_PAGE_SIZE            = 'Settings/SET_PAGE_SIZE';

export const types = {
  SET_URL_LANGUAGE,
  SET_UI_LANGUAGE,
  SET_CONTENT_LANGUAGES,
  SET_SHOW_ALL_CONTENT,
  SET_PAGE_SIZE,
};

/* Actions */

const setUrlLanguage      = createAction(SET_URL_LANGUAGE);
const setUILanguage       = createAction(SET_UI_LANGUAGE);
const setContentLanguages = createAction(SET_CONTENT_LANGUAGES);
const setShowAllContent   = createAction(SET_SHOW_ALL_CONTENT);
const setPageSize         = createAction(SET_PAGE_SIZE);
// const setLanguages         = createAction(SET_LANGUAGES);
// const setHideUILangContent = createAction(SET_HIDE_UI_LANG_CONTENT);

export const actions = {
  setUrlLanguage,
  setUILanguage,
  setContentLanguages,
  setShowAllContent,
  setPageSize,
  //setLanguages,
  //setHideUILangContent,
};

/* Reducer */
export const initialState = {
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

export const onSetUrlLanguage = (draft, payload) => {
  // console.log('onSetUrlLanguage', draft.urlLanguage, payload);
  if (payload) {
    draft.urlLanguage = [payload];
  } else if (draft.urlLanguage.length > 0) {
    draft.urlLanguage.length = 0;
  }
}

export const onSetUILanguage = (draft, payload) => {
  setCookie(COOKIE_UI_LANG, payload.uiLang);
  draft.uiLang = payload.uiLang;
  draft.uiDir = getLanguageDirection(payload.uiLang)
}

export const onSetContentLanguages = (draft, payload) => {
  setCookie(COOKIE_CONTENT_LANGS, payload.contentLanguages);
  draft.contentLanguages = payload.contentLanguages;
}

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
}

/*const onSetHideUILangContent = (draft, payload) => {
  draft.hideUILangContent = payload;
  setCookie(COOKIE_HIDE_UI_LANG_CONTENT, payload);
}*/

const onSetPageSize = (draft, payload) => {
  draft.pageSize = payload;
};

export const reducer = handleActions({
  [SET_URL_LANGUAGE]: onSetUrlLanguage,
  [SET_UI_LANGUAGE]: onSetUILanguage,
  [SET_CONTENT_LANGUAGES]: onSetContentLanguages,
  [SET_SHOW_ALL_CONTENT]: onSetShowAllContent,
  [SET_PAGE_SIZE]: onSetPageSize,
// [SET_LANGUAGES]: onSetLanguages,
// [SET_HIDE_UI_LANG_CONTENT]: onSetHideUILangContent,
}, initialState);

/* Selectors */
const getUrlLang           = state => (state.urlLanguage.length && state.urlLanguage[0]) || '';
const getUIDir             = state => !!state.urlLanguage.length ? getLanguageDirection(state.urlLanguage[0]) : state.uiDir;
const getUILang            = (state, skipUrl) => !state.urlLanguage.length || skipUrl ? state.uiLang : state.urlLanguage[0];
const getContentLanguages  = (state, skipFlags) => {
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
