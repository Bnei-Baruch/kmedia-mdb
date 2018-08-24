import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const FETCH_ALL_MEDIA_FOR_DATE         = 'SimpleMode/FETCH_ALL_MEDIA_FOR_DATE';
const FETCH_ALL_MEDIA_FOR_DATE_SUCCESS = 'SimpleMode/FETCH_ALL_MEDIA_FOR_DATE_SUCCESS';
const FETCH_ALL_MEDIA_FOR_DATE_FAILURE = 'SimpleMode/FETCH_ALL_MEDIA_FOR_DATE_FAILURE';

export const types = {
  FETCH_ALL_MEDIA_FOR_DATE,
  FETCH_ALL_MEDIA_FOR_DATE_SUCCESS,
  FETCH_ALL_MEDIA_FOR_DATE_FAILURE,
};

/* Actions */

const fetchAllMediaForDate        = createAction(FETCH_ALL_MEDIA_FOR_DATE, date => date);
const fetchAllMediaForDateSuccess = createAction(FETCH_ALL_MEDIA_FOR_DATE_SUCCESS);
const fetchAllMediaForDateFailure = createAction(FETCH_ALL_MEDIA_FOR_DATE_FAILURE);

export const actions = {
  fetchAllMediaForDate,
  fetchAllMediaForDateSuccess,
  fetchAllMediaForDateFailure
};

/* Reducer */

const initialState = {
  allMeRdia: {
    total: 0,
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
  case FETCH_ALL_MEDIA_FOR_DATE:
    wip = true;
    err = null;
    break;
  case FETCH_ALL_MEDIA_FOR_DATE_SUCCESS:
    wip = false;
    err = null;
    break;
  case FETCH_ALL_MEDIA_FOR_DATE_FAILURE:
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

const onFetchAllMediaSuccess = (state, action) => ({
  ...state,
  items: action.payload,
});

const onSetLanguage = state => (
  {
    ...state,
    items: initialState.items,
  }
);

const onSSRPrepare = state => ({
  ...state,
  err: state.err ? state.err.toString() : state.err,
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_ALL_MEDIA_FOR_DATE]: setStatus,
  [FETCH_ALL_MEDIA_FOR_DATE_SUCCESS]: (state, action) => setStatus(onFetchAllMediaSuccess(state, action), action),
  [FETCH_ALL_MEDIA_FOR_DATE_FAILURE]: setStatus,
}, initialState);

/* Selectors */

const getWip      = state => state.wip;
const getErrors   = state => state.err;
const getAllMedia = state => state.items;

export const selectors = {
  getWip,
  getErrors,
  getAllMedia,
};
