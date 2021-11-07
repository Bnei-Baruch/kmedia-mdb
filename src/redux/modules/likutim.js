import { createAction, handleActions } from 'redux-actions';
import { types as ssr } from './ssr';

const FETCH_LIKUTIM           = 'FETCH_LIKUTIM';
const FETCH_LIKUTIM_SUCCESS   = 'FETCH_LIKUTIM_SUCCESS';
const FETCH_LIKUTIM_FAILURE   = 'FETCH_LIKUTIM_FAILURE';

export const types = {
  FETCH_LIKUTIM,
  FETCH_LIKUTIM_SUCCESS,
  FETCH_LIKUTIM_FAILURE,
}

// Actions
const fetchLikutim         = createAction(FETCH_LIKUTIM);
const fetchLikutimSuccess  = createAction(FETCH_LIKUTIM_SUCCESS);
const fetchLikutimFailure  = createAction(FETCH_LIKUTIM_FAILURE);

export const actions = {
  fetchLikutim,
  fetchLikutimSuccess,
  fetchLikutimFailure,
};

/* Reducer */
const initialState = {
  wip: false,
  err: null,
  likutim: [],
};

const onSuccess = (state, action) => {
  state.wip = false;
  state.err = null;
  state.likutim = action.payload.content_units;

  return state;
};

const onFailure = (state, payload) => {
  state.wip = false;
  state.err = payload;
  state.likutim = [];

  return state;
};

const onSSRPrepare = state => {
  if (state.err) {
    state.err = state.err.toString();
  }
};


export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [FETCH_LIKUTIM]: state => {
    state.wip = true;
  },
  [FETCH_LIKUTIM_SUCCESS]: onSuccess,
  [FETCH_LIKUTIM_FAILURE]: onFailure,
}, initialState);

const getWip       = state => state.wip;
const getError     = state => state.err;
const getLikutim   = state => state.likutim;

export const selectors = {
  getWip,
  getError,
  getLikutim,
}
