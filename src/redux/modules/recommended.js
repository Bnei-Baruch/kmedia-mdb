import { createAction, handleActions } from 'redux-actions';
import { types as ssr } from './ssr';
import { types as player } from './player';
import { types as chronicles } from './chronicles';

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
  skipUids: [],
};

const onSuccess = (state, action) => {
  state.wip = false;
  state.err = null;
  state.recommendedItems = action.payload.recommendedItems;

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

const onPlayerPlay = (state, action) => {
  const unitUid = action.payload;
  if (unitUid && !state.skipUids.includes(unitUid)) {
    state.skipUids.push(unitUid);
  }
}

const onUserInactive = state => {
  state.skipUids.length = 0;
}

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [player.PLAYER_PLAY]: onPlayerPlay,
  [chronicles.USER_INACTIVE]: onUserInactive,

  [FETCH_RECOMMENDED]: state => {
    state.wip = true;
  },
  [FETCH_RECOMMENDED_SUCCESS]: onSuccess,
  [FETCH_RECOMMENDED_FAILURE]: onFailure,
}, initialState);

const getWip              = state => state.wip;
const getError            = state => state.err;
const getRecommendedItems = state => state.recommendedItems;
const getSkipUids         = state => state.skipUids;

export const selectors = {
  getWip,
  getError,
  getRecommendedItems,
  getSkipUids,
}
