import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

/* Reducer */
const initialState = {
  settings: {},
  isReadable: false,
  tocIsActive: false,
  match: ''
};

const updateLocalStorage = state => localStorage.setItem('library-settings', JSON.stringify(state.settings));

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
const setReadable    = (state, { payload }) => void (state.isReadable = payload);
const setTocIsActive = (state, { payload }) => {
  const _active     = payload ?? !state.tocIsActive;
  state.tocIsActive = _active;
};
const setLanguage    = (state, { payload }) => {
  state.language = payload;
};
const setMatch       = (state, { payload }) => {
  state.match = payload;
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
    setLanguage,
    setMatch,
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
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
  getLanguage: state => state.language,
  getMatch: state => state.match
};
