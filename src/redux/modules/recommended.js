import { createAction, handleActions } from 'redux-actions';
import { types as ssr } from './ssr';

const FETCH_RECOMMENDED           = 'FETCH_RECOMMENDED';
const FETCH_RECOMMENDED_SUCCESS   = 'FETCH_RECOMMENDED_SUCCESS';
const FETCH_RECOMMENDED_FAILURE   = 'FETCH_RECOMMENDED_FAILURE';

export const types = {
  FETCH_RECOMMENDED,
  FETCH_RECOMMENDED_SUCCESS,
  FETCH_RECOMMENDED_FAILURE,
}

// Actions
const fetchRecommended         = createAction(FETCH_RECOMMENDED);
const fetchRecommendedSuccess  = createAction(FETCH_RECOMMENDED_SUCCESS);
const fetchRecommendedFailure  = createAction(FETCH_RECOMMENDED_FAILURE);

export const actions = {
  fetchRecommended,
  fetchRecommendedSuccess,
  fetchRecommendedFailure,
};

/* Reducer */
const initialState = {
  wip: false,
  err: null,
  recommendedItems: [],
};

const onSuccess = (state, action) => {
  state.wip = false;
  state.err = null;
  state.recommendedItems = action.payload;

  return state;
};

const onFailure = (state, payload) => {
  state.wip = false;
  state.err = payload;
  state.recommendedItems = [];

  return state;
};

const onSSRPrepare = state => {
  if (state.err) {
    state.err = state.err.toString();
  }
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [FETCH_RECOMMENDED]: state => { state.wip = true; },
  [FETCH_RECOMMENDED_SUCCESS]: onSuccess,
  [FETCH_RECOMMENDED_FAILURE]: onFailure,
}, initialState);

const getWip          = state => state.wip;
const getError        = state => state.err;
const getRecommendedItems = state => state.recommendedItems;

export const selectors = {
  getWip,
  getError,
  getRecommendedItems
}