import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const SET_PAGE           = 'Twitter/SET_PAGE';
const FETCH_DATA         = 'Twitter/FETCH_DATA';
const FETCH_DATA_SUCCESS = 'Twitter/FETCH_DATA_SUCCESS';
const FETCH_DATA_FAILURE = 'Twitter/FETCH_DATA_FAILURE';

export const types = {
  SET_PAGE,
  FETCH_DATA,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
};

/* Actions */

const setPage          = createAction(SET_PAGE, (namespace, pageNo) => ({ pageNo }));
const fetchData        = createAction(FETCH_DATA,
  (namespace, pageNo, params = {}) => ({ namespace, pageNo, ...params, }));
const fetchDataSuccess = createAction(FETCH_DATA_SUCCESS);
const fetchDataFailure = createAction(FETCH_DATA_FAILURE);

export const actions = {
  setPage,
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
};

/* Reducer */

const initialState = {
  tweets: [],
  total: 0,
  pageNo: 1,
  wip: false,
  err: null,
};

const onSetLanguage = state => ({
  ...initialState,
  pageNo: state.pageNo,
  total: state.total,
});

const onSetPage = (state, action) => ({
  ...state,
  pageNo: action.payload.pageNo,
});

const onData = (state, action) => ({
  ...state,
  wip: false,
  err: null,
  ...action.payload,
});

const onSSRPrepare = state => ({
  ...state,
  err: state.err ? state.err.toString() : state.err,
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: onSetLanguage,

  [SET_PAGE]: onSetPage,
  [FETCH_DATA]: state => ({ ...state, wip: true }),
  [FETCH_DATA_SUCCESS]: onData,
  [FETCH_DATA_FAILURE]: (state, action) => ({ ...state, wip: false, data: null, err: action.payload }),
}, initialState);

/* Selectors */

const getTweets = state => state.tweets;
const getTotal  = state => state.total;
const getPageNo = state => state.pageNo;
const getWip    = state => state.wip;
const getError  = state => state.err;

export const selectors = {
  getTweets,
  getTotal,
  getPageNo,
  getWip,
  getError,
};
