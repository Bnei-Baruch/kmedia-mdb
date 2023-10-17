import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { CT_SOURCE } from '@/src/helpers/consts';

/* Reducer */
const initialState = {
  settings: {},
  isReadable: false,
  tocIsActive: false,
  match: ''
};

const updateLocalStorage       = state => localStorage.setItem('library-settings', JSON.stringify(state.settings));
const checkRabashGroupArticles = uid => {
  if (/^gr-/.test(uid)) { // Rabash Group Articles
    const result = /^gr-(.+)/.exec(uid);
    return { uid: result[1], isGr: true };
  }

  return { uid, isGr: false };
};

const setFontSize    = (state, { payload }) => {
  if ((payload > 0 && state.settings.fontSize >= 8) || (payload < 0 && state.settings.fontSize <= -3)) {
    return;
  }
  state.settings.fontSize = payload;
  updateLocalStorage(state);
};
const setFontType    = (state, { payload }) => {
  state.settings.fontType = payload;
  updateLocalStorage(state);
};
const setTheme       = (state, { payload }) => {
  state.settings.theme = payload;
  updateLocalStorage(state);
};
const setReadable    = (state, { payload }) => void (state.isReadable = payload ?? !state.isReadable);
const setTocIsActive = (state, { payload }) => void (state.tocIsActive = payload ?? !state.tocIsActive);
const setMatch       = (state, { payload }) => void (state.match = payload);
const setSubjectInfo = (state, { payload }) => {
  state.subject                = payload;
  const { id, language, type } = payload;

  const { uid, isGr } = checkRabashGroupArticles(id);
  const properties    = isGr ? { uid_prefix: 'gr-' } : {};
  state.bookmarkInfo  = { language, subject_uid: uid, subject_type: type, properties };
  state.labelInfo     = { language, content_unit: uid, properties };
};

export const textFileSlice = createSlice({
  name: 'textFile',
  initialState,
  reducers: {
    setFontSize,
    setFontType,
    setTheme,
    setReadable,
    setTocIsActive,
    setMatch,
    setSubjectInfo,
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      //take data from localstorage on the client
      let settings = (typeof localStorage === 'undefined') ? {} : JSON.parse(localStorage.getItem('library-settings')) || {};
      return {
        ...state,
        ...{ ...action.payload.textFile, settings },
      };
    });
  }
});

/* Selectors */
export const selectors = {
  getSettings: state => state.settings,
  getIsReadable: state => state.isReadable,
  getTocIsActive: state => state.tocIsActive,
  getMatch: state => state.match,
  getSubjectInfo: state => state.subject,
  getLanguage: state => state.subject.language,
  getBookmarkInfo: state => state.bookmarkInfo,
  getLabelInfo: state => state.labelInfo
};
