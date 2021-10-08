import { createAction, handleActions } from 'redux-actions';
import { types as ssr } from './ssr';
import { types as player } from './player';
import { types as chronicles } from './chronicles';

const FETCH_RECOMMENDED         = 'FETCH_RECOMMENDED';
const FETCH_RECOMMENDED_SUCCESS = 'FETCH_RECOMMENDED_SUCCESS';
const FETCH_RECOMMENDED_FAILURE = 'FETCH_RECOMMENDED_FAILURE';
const FETCH_VIEWS               = 'FETCH_VIEWS';
const RECEIVE_VIEWS             = 'RECEIVE_VIEWS';
const RECEIVE_WATCHING_NOW      = 'RECEIVE_WATCHING_NOW';

export const types = {
  FETCH_RECOMMENDED,
  FETCH_RECOMMENDED_SUCCESS,
  FETCH_RECOMMENDED_FAILURE,
  FETCH_VIEWS,
  RECEIVE_VIEWS,
  RECEIVE_WATCHING_NOW,
};

// Actions
const fetchRecommended        = createAction(FETCH_RECOMMENDED);
const fetchRecommendedSuccess = createAction(FETCH_RECOMMENDED_SUCCESS);
const fetchRecommendedFailure = createAction(FETCH_RECOMMENDED_FAILURE);
const receiveViews            = createAction(RECEIVE_VIEWS);
const fetchViews              = createAction(FETCH_VIEWS);
const receiveWatchingNow      = createAction(RECEIVE_WATCHING_NOW);

export const actions = {
  fetchRecommended,
  fetchRecommendedSuccess,
  fetchRecommendedFailure,
  receiveViews,
  fetchViews,
  receiveWatchingNow,
};

/* Reducer */
const initialState = {
  wip: false,
  err: null,
  feeds: {},
  skipUids: [],
  views: {},
  watchingNow: {},
};

const onSuccess = (state, action) => {
  state.wip   = false;
  state.err   = null;
  state.feeds = action.payload.feeds;

  return state;
};

const onFailure = (state, payload) => {
  state.wip   = false;
  state.err   = payload;
  state.feeds = {};

  return state;
};

const onSSRPrepare = state => {
  if (state.err) {
    state.err = state.err.toString();
  }
  return state
};

const onPlayerPlay = (state, action) => {
  const unitUid = action.payload;
  if (unitUid && !state.skipUids.includes(unitUid)) {
    state.skipUids.push(unitUid);
  }
  return state;
};

const onUserInactive = state => {
  state.skipUids.length = 0;
  return state;
};

const onReceiveViews = (state, action) => {
  Object.assign(state.views, action.payload);
  return state;
};

const onReceiveWatchingNow = (state, action) => {
  Object.assign(state.watchingNow, action.payload);
  return state;
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [player.PLAYER_PLAY]: onPlayerPlay,
  [chronicles.USER_INACTIVE]: onUserInactive,

  [FETCH_RECOMMENDED]: state => ({ wip: true, ...state }),
  [FETCH_RECOMMENDED_SUCCESS]: onSuccess,
  [FETCH_RECOMMENDED_FAILURE]: onFailure,
  [RECEIVE_VIEWS]: onReceiveViews,
  [RECEIVE_WATCHING_NOW]: onReceiveWatchingNow,
}, initialState);

const getWip                  = state => state.wip;
const getError                = state => state.err;
const getRecommendedItems     = (feedName, state) => (state.feeds[feedName] || []);
const getManyRecommendedItems = (feedNames, state) => feedNames.reduce((acc, feedName) => {
  acc[feedName] = state.feeds[feedName] || [];
  return acc;
}, {});
const getSkipUids             = state => state.skipUids;
const getViews                = (uid, state) => (state.views[uid] || -1);
const getManyViews            = (uids, state) => uids.map(uid => (state.views[uid] || -1));
const getWatchingNow          = (uid, state) => (state.watchingNow[uid] || -1);
const getManyWatchingNow      = (uids, state) => uids.map(uid => (state.watchingNow[uid] || -1));

export const selectors = {
  getWip,
  getError,
  getRecommendedItems,
  getManyRecommendedItems,
  getSkipUids,
  getViews,
  getManyViews,
  getWatchingNow,
  getManyWatchingNow,
};
