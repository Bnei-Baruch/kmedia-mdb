import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const FETCH_FOR_DATE         = 'SimpleMode/FETCH_FOR_DATE';
const FETCH_FOR_DATE_SUCCESS = 'SimpleMode/FETCH_FOR_DATE_SUCCESS';
const FETCH_FOR_DATE_FAILURE = 'SimpleMode/FETCH_FOR_DATE_FAILURE';

export const types = {
  FETCH_FOR_DATE,
  FETCH_FOR_DATE_SUCCESS,
  FETCH_FOR_DATE_FAILURE,
};

/* Actions */

const fetchForDate        = createAction(FETCH_FOR_DATE);
const fetchForDateSuccess = createAction(FETCH_FOR_DATE_SUCCESS);
const fetchForDateFailure = createAction(FETCH_FOR_DATE_FAILURE);

export const actions = {
  fetchForDate,
  fetchForDateSuccess,
  fetchForDateFailure
};

/* Reducer */

const initialState = {
  items: {
    lessons: [],
    others: [],
  },
  wip: false,
  err: null,
};

/**
 * Set the wip and err part of the state
 * @param state
 * @param action
 * @returns {{wip: {}, err: {}}}
 */
const setStatus = (state, action) => {
  let { wip, err } = state;

  switch (action.type) {
  case FETCH_FOR_DATE:
    wip = true;
    err = null;
    break;
  case FETCH_FOR_DATE_SUCCESS:
    wip = false;
    err = null;
    break;
  case FETCH_FOR_DATE_FAILURE:
    wip = false;
    err = action.payload;
    break;
  default:
    break;
  }

  return {
    ...state,
    wip,
    err,
  };
};

const onFetchForDateSuccess = (state, action) => {
  const items   = {};
  items.lessons = (action.payload.lessons || []).map(x => x.id);
  items.others  = (action.payload.others || []).map(x => x.id);

  return {
    ...state,
    items,
  };
};

const onSetLanguage = () => ({ ...initialState });

const onSSRPrepare = state => ({
  ...state,
  err: state.err ? state.err.toString() : state.err,
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_FOR_DATE]: setStatus,
  [FETCH_FOR_DATE_SUCCESS]: (state, action) => setStatus(onFetchForDateSuccess(state, action), action),
  [FETCH_FOR_DATE_FAILURE]: setStatus,
}, initialState);

/* Selectors */

const getItems = state => state.items;
const getWip   = state => state.wip;
const getError = state => state.err;

export const selectors = {
  getItems,
  getWip,
  getError,
};
