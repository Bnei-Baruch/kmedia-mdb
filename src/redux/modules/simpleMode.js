import { createAction, handleActions } from 'redux-actions';
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
 */
const setStatus = (draft, payload, type) => {
  switch (type) {
    case FETCH_FOR_DATE:
      draft.wip = true;
      draft.err = null;
      break;
    case FETCH_FOR_DATE_SUCCESS:
      draft.wip = false;
      draft.err = null;
      break;
    case FETCH_FOR_DATE_FAILURE:
      draft.wip = false;
      draft.err = payload;
      break;
    default:
      break;
  }
};

const onFetchForDateSuccess = (draft, payload, type) => {
  console.log('onFetchForDateSuccess simpleMode', payload);
  draft.items         = {};
  draft.items.lessons = (payload.lessons || []).map(x => x.id);
  draft.items.others  = (payload.others || []).map(x => x.id);
  setStatus(draft, payload, type);
};

const onSetLanguage = (draft, payload) => {
  console.log('onSetLanguage simpleMode', payload);
  draft.items.lessons = [];
  draft.items.others  = [];
};

const onSSRPrepare = draft => {
  if (draft.err) {
    draft.err = draft.err.toString();
  }
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  //[settings.SET_UI_LANGUAGE]: onSetLanguage,
  //[settings.SET_CONTENT_LANGUAGES]: onSetLanguage,

  [FETCH_FOR_DATE]: setStatus,
  [FETCH_FOR_DATE_SUCCESS]: onFetchForDateSuccess,
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
