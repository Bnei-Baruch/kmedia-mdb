import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';

/* Types */
const FETCH_DATA         = 'Home/FETCH_DATA';
const FETCH_DATA_SUCCESS = 'Home/FETCH_DATA_SUCCESS';
const FETCH_DATA_FAILURE = 'Home/FETCH_DATA_FAILURE';

export const types = {
  FETCH_DATA,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
};

/* Actions */

const fetchData        = createAction(FETCH_DATA);
const fetchDataSuccess = createAction(FETCH_DATA_SUCCESS);
const fetchDataFailure = createAction(FETCH_DATA_FAILURE);

export const actions = {
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
};

/* Reducer */

const initialState = {
  data: null,
  wip: false,
  err: null,
};

const onSetLanguage = state => (
  {
    ...initialState,
  }
);

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_DATA]: state => ({ ...state, wip: true }),
  [FETCH_DATA_SUCCESS]: (state, action) => ({ ...state, wip: false, data: action.payload, err: null }),
  [FETCH_DATA_FAILURE]: (state, action) => ({ ...state, wip: false, data: null, err: action.payload }),
}, initialState);

/* Selectors */

const getData  = state => state.data;
const getWip   = state => state.wip;
const getError = state => state.err;

export const selectors = {
  getData,
  getWip,
  getError,
};
