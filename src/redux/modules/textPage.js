import { createAction } from 'redux-actions';

import { handleActions } from './settings';
import { types as assetsTypes } from './assets';
import { selectTextFile, selectMP3 } from '../../components/Pages/WithText/helper';
import { assetUrl } from '../../helpers/Api';

const updateLocalStorage = state => {
  const settings = { ...state.settings };
  localStorage.setItem('library-settings', JSON.stringify(settings));
};

const buildUrl = state => {
  if (typeof window === 'undefined') return '';

  const { protocol, hostname, port, pathname } = window.location;

  const _pathname = !state.file ? pathname : `${state.file.language}/${pathname.slice(4)}`;
  return `${protocol}//${hostname}${port ? `:${port}` : ''}/${_pathname}`;

};

/* Types */

const SET_ZOOM_SIZE           = 'text/SET_ZOOM_SIZE';
const SET_FONT_TYPE           = 'text/SET_FONT_TYPE';
const SET_THEME               = 'text/SET_THEME';
const SET_READABLE            = 'text/SET_READABLE';
const SET_TOC_IS_ACTIVE       = 'text/SET_TOC_IS_ACTIVE';
const CHANGE_SUBJECT_LANGUAGE = 'text/CHANGE_SUBJECT_LANGUAGE';
const SET_TOC_SORT_BY         = 'text/SET_TOC_SORT_BY';
const SET_TOC_MATCH           = 'text/SET_TOC_MATCH';
const SET_URL_PATH            = 'text/SET_URL_PATH';
const SET_URL_SELECT          = 'text/SET_URL_SELECT';
const EXPAND_NOTES            = 'text/EXPAND_NOTES';
const SET_FULLSCREEN          = 'text/SET_FULLSCREEN';
const SET_SCROLL_DIR          = 'text/SET_SCROLL_DIR';
const SET_SIDE_OFFSET         = 'text/SET_SIDE_OFFSET';
const TOGGLE_TEXT_ONLY        = 'text/TOGGLE_TEXT_ONLY';
const TOGGLE_SCAN             = 'text/TOGGLE_SCAN';
const SET_IS_SEARCH           = 'text/SET_IS_SEARCH';

const FETCH_SUBJECT         = 'text/FETCH_SUBJECT';
const FETCH_SUBJECT_SUCCESS = 'text/FETCH_SUBJECT_SUCCESS';
const FETCH_SUBJECT_FAILURE = 'text/FETCH_SUBJECT_FAILURE';

export const types = {
  FETCH_SUBJECT
};

/* Actions */
const setZoomSize    = createAction(SET_ZOOM_SIZE);
const setFontType    = createAction(SET_FONT_TYPE);
const setTheme       = createAction(SET_THEME);
const setReadable    = createAction(SET_READABLE);
const setTocIsActive = createAction(SET_TOC_IS_ACTIVE);
const setTocMatch    = createAction(SET_TOC_MATCH);
const setTocSortBy   = createAction(SET_TOC_SORT_BY);
const changeLanguage = createAction(CHANGE_SUBJECT_LANGUAGE);
const setUrlPath     = createAction(SET_URL_PATH);
const setUrlSelect   = createAction(SET_URL_SELECT);
const expandNotes    = createAction(EXPAND_NOTES);
const setFullscreen  = createAction(SET_FULLSCREEN);
const setScrollDir   = createAction(SET_SCROLL_DIR);
const setSideOffset  = createAction(SET_SIDE_OFFSET);
const toggleTextOnly = createAction(TOGGLE_TEXT_ONLY);
const toggleScan     = createAction(TOGGLE_SCAN);
const setIsSearch    = createAction(SET_IS_SEARCH);

const fetchSubject        = createAction(FETCH_SUBJECT);
const fetchSubjectSuccess = createAction(FETCH_SUBJECT_SUCCESS);
const fetchSubjectFailure = createAction(FETCH_SUBJECT_FAILURE);

export const actions = {
  setZoomSize,
  setFontType,
  setTheme,
  setReadable,
  setTocIsActive,
  setTocMatch,
  setTocSortBy,
  changeLanguage,
  setUrlPath,
  setUrlSelect,
  expandNotes,
  setFullscreen,
  setScrollDir,
  setSideOffset,
  toggleTextOnly,
  toggleScan,
  setIsSearch,

  fetchSubject,
  fetchSubjectSuccess,
  fetchSubjectFailure,
};

/* Reducer */
const initialState = {
  settings: {},
  isReadable: false,
  tocIsActive: false,
  scrollDir: 0,
  match: '',
  subject: {},
  wipErr: {
    wip: false, err: null
  },
  urlInfo: {},
  tocInfo: { sortByAZ: true },
  scanInfo: { on: false }
};

const onZoomSize = (state, payload) => {
  let size = state.settings.zoomSize || 1;
  if (payload === 'up') {
    size = size + .2;
  } else if (payload === 'down') {
    size = size - .2;
  } else {
    size = payload;
  }

  size = Math.min(4, size);
  size = Math.max(1, size);

  state.settings.zoomSize = size;
  updateLocalStorage(state);
};

const onFontType = (state, payload) => {
  state.settings.fontType = payload;
  updateLocalStorage(state);
};

const onTheme = (state, payload) => {
  state.settings.theme = payload;
  updateLocalStorage(state);
};

const onReadable       = (state, payload) => void (state.isReadable = payload ?? !state.isReadable);
const onTocIsActive    = (state, payload) => void (state.tocIsActive = payload ?? !state.tocIsActive);
const onChangeLanguage = (state, payload) => {
  state.file = selectTextFile(state.subject.files, state.subject.id, payload);
  state.mp3  = selectMP3(state.subject.files, payload);

  state.urlInfo.url = buildUrl(state);
};

const onFetchSubject = (state, payload) => {
  state.wip        = true;
  state.err        = null;
  state.subject.id = payload;
};

const onFetchSubjectSuccess = (state, payload) => {
  const { subject, file, isGr } = payload;

  subject.properties  = isGr ? { uid_prefix: 'gr-' } : {};
  state.subject       = subject;
  state.wipErr        = { wip: false, err: null };
  state.file          = file;
  state.mp3           = selectMP3(subject.files, file.language);
  state.scanInfo.file = subject.files.find(f => f.insert_type === 'source-scan');
  state.urlInfo.url   = buildUrl(state);
};

const onFetchSubjectFailure = (state, payload) => {
  state.wipErr = { wip: false, err: payload };
};

const onReceiveLikutMP3 = state => {
  state.mp3 = assetUrl(`api/km_audio/file/${state.file.id}?language=${state.file.language}`);
};

export const reducer = handleActions({
  [SET_ZOOM_SIZE]: onZoomSize,
  [SET_FONT_TYPE]: onFontType,
  [SET_THEME]: onTheme,
  [SET_READABLE]: onReadable,
  [SET_TOC_IS_ACTIVE]: onTocIsActive,
  [SET_TOC_SORT_BY]: state => state.tocInfo.sortByAZ = !state.tocInfo.sortByAZ,
  [SET_TOC_MATCH]: (state, payload) => state.tocInfo.match = payload,
  [CHANGE_SUBJECT_LANGUAGE]: onChangeLanguage,
  [SET_URL_PATH]: (state, payload) => {
    state.urlInfo.url = payload ?? buildUrl(state);
  },
  [SET_URL_SELECT]: (state, payload) => state.urlInfo.select = payload || null,
  [EXPAND_NOTES]: state => state.expandNotes = !state.expandNotes,
  [SET_FULLSCREEN]: (state, payload) => state.isFullscreen = payload ?? !state.isFullscreen,
  [SET_SCROLL_DIR]: (state, payload) => state.scrollDir = payload,
  [SET_SIDE_OFFSET]: (state, payload) => state.sideOffset = payload,
  [TOGGLE_TEXT_ONLY]: (state, payload) => state.textOnly = payload ?? !state.textOnly,
  [TOGGLE_SCAN]: state => state.scanInfo.on = !state.scanInfo.on,
  [SET_IS_SEARCH]: state => state.isSearch = !state.isSearch,

  [FETCH_SUBJECT]: onFetchSubject,
  [FETCH_SUBJECT_SUCCESS]: onFetchSubjectSuccess,
  [FETCH_SUBJECT_FAILURE]: onFetchSubjectFailure,

  [assetsTypes.MERGE_KITEI_MAKOR_SUCCESS]: onReceiveLikutMP3

}, initialState);

/* Selectors */
const getSettings     = state => state.settings;
const getReadable     = state => state.readable;
const getTocIsActive  = state => state.tocIsActive;
const getTocInfo      = state => state.tocInfo;
const getSubject      = state => state.subject;
const getWipErr       = state => state.wipErr;
const getFile         = state => state.file;
const getUrlInfo      = state => state.urlInfo;
const getMP3          = state => state.mp3;
const getExpandNotes  = state => state.expandNotes;
const getIsFullscreen = state => state.isFullscreen;
const getScrollDir    = state => state.scrollDir;
const getSideOffset   = state => state.sideOffset;
const getTextOnly     = state => state.textOnly;
const getScanInfo = state => state.scanInfo;
const getIsSearch = state => state.isSearch;

export const selectors = {
  getSettings,
  getReadable,
  getTocIsActive,
  getTocInfo,
  getSubject,
  getWipErr,
  getFile,
  getUrlInfo,
  getMP3,
  getExpandNotes,
  getIsFullscreen,
  getScrollDir,
  getSideOffset,
  getTextOnly,
  getScanInfo,
  getIsSearch,
};
