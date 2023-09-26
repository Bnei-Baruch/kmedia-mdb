import { createAction, handleActions } from 'redux-actions';
import { types as chronicles } from './chronicles';
import { types as ssr } from './ssr';

const FETCH_RECOMMENDED         = 'FETCH_RECOMMENDED';
const FETCH_RECOMMENDED_SUCCESS = 'FETCH_RECOMMENDED_SUCCESS';
const FETCH_RECOMMENDED_FAILURE = 'FETCH_RECOMMENDED_FAILURE';
const FETCH_VIEWS               = 'FETCH_VIEWS';
const RECEIVE_VIEWS             = 'RECEIVE_VIEWS';
const RECEIVE_WATCHING_NOW      = 'RECEIVE_WATCHING_NOW';
const PLAYER_PLAY_WITH_UID      = 'PLAYER_PLAY_WITH_UID';

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
const playerPlayWithUid       = createAction(PLAYER_PLAY_WITH_UID);

export const actions = {
  fetchRecommended,
  fetchRecommendedSuccess,
  fetchRecommendedFailure,
  receiveViews,
  fetchViews,
  receiveWatchingNow,
  playerPlayWithUid,
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

const onSuccess = (draft, payload) => {
  draft.wip   = false;
  draft.err   = null;
  draft.feeds = payload.feeds;
};

const onFailure = (draft, payload) => {
  draft.wip   = false;
  draft.err   = payload;
  draft.feeds = {};
};

const onSSRPrepare = draft => {
  if (draft.err) {
    draft.err = draft.err.toString();
  }
};

const onPlayerPlay = (draft, payload) => {
  if (payload && !draft.skipUids.includes(payload)) {
    draft.skipUids.push(payload);
  }
};

const onUserInactive = draft => draft.skipUids.length = 0;

const onReceiveViews = (draft, payload) => draft.views = { ...draft.views, ...payload };

const onReceiveWatchingNow = (draft, payload) => draft.watchingNow = { ...draft.watchingNow, ...payload };

const onRecommended = draft => draft.wip = true;

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [PLAYER_PLAY_WITH_UID]: onPlayerPlay,
  //[chronicles.USER_INACTIVE]: onUserInactive,

  [FETCH_RECOMMENDED]: onRecommended,
  [FETCH_RECOMMENDED_SUCCESS]: onSuccess,
  [FETCH_RECOMMENDED_FAILURE]: onFailure,
  [RECEIVE_VIEWS]: onReceiveViews,
  [RECEIVE_WATCHING_NOW]: onReceiveWatchingNow,
}, initialState);

const getWip                  = state => state.wip;
const getError                = state => state.err;
const getRecommendedItems     = (feedName, state) => (state.feeds[feedName] || []);
const getManyRecommendedItems = (feedNames, state) => feedNames?.reduce((acc, feedName) => {
  acc[feedName] = state.feeds[feedName] || [];
  return acc;
}, {});
const getSkipUids             = state => state.skipUids;
const getViews                = (uid, state) => (state?.views[uid] || -1);
const getManyViews            = (uids, state) => uids?.map(uid => (state.views[uid] || -1));
const getWatchingNow          = (uid, state) => (state.watchingNow[uid] || -1);
const getManyWatchingNow      = (uids, state) => uids?.map(uid => (state.watchingNow[uid] || -1));

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
