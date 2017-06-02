import { createAction, handleActions } from 'redux-actions';

/* Types */

const SET_LANGUAGE  = 'Settings/SET_LANGUAGE';
const SET_PAGE_SIZE = 'Settings/SET_PAGE_SIZE';

export const types = {
  SET_LANGUAGE,
  SET_PAGE_SIZE,
};

/* Actions */

const setLanguage = createAction(SET_LANGUAGE);
const setPageSize = createAction(SET_PAGE_SIZE);

export const actions = {
  setLanguage,
  setPageSize,
};

/* Reducer */

const initialState = {
  language: 'ru',
  pageSize: 10,
};

export const reducer = handleActions({
  [SET_LANGUAGE]: (state, action) => ({
    ...state,
    language: action.language,
  }),
  [SET_PAGE_SIZE]: (state, action) => ({
    ...state,
    pageSize: action.pageSize,
  }),
}, initialState);

/* Selectors */

const getLanguage = state => state.language;
const getPageSize = state => state.pageSize;

export const selectors = {
  getLanguage,
  getPageSize
};
