import { createSlice } from '@reduxjs/toolkit';
import { actions as chronicles } from './chronicles';
import { actions as ssrActions } from './ssr';

const recommendedSlice = createSlice({
  name        : 'recommended',
  initialState: {
    wip        : false,
    err        : null,
    feeds      : {},
    skipUids   : [],
    views      : {},
    watchingNow: {}
  },

  reducers     : {
    fetchRecommended       : state => void (state.wip = true),
    fetchRecommendedSuccess: (state, { payload: { feeds } }) => {
      state.wip   = false;
      state.err   = null;
      state.feeds = feeds;
    },
    fetchRecommendedFailure: (state, payload) => {
      state.wip   = false;
      state.err   = payload;
      state.feeds = {};
    },

    playerPlayWithUid: (state, { payload }) => {
      if (payload && !state.skipUids.includes(payload)) {
        state.skipUids.push(payload);
      }
    },

    fetchViews        : () => void ({}),
    receiveViews      : (state, { payload }) => void (state.views = { ...state.views, ...payload }),
    receiveWatchingNow: (state, { payload }) => void (state.watchingNow = { ...state.watchingNow, ...payload })
  },
  extraReducers: builder => {
    builder
      .addCase(ssrActions.prepare, state => {
        if (state.err) {
          state.err = state.err.toString();
        }
      })
      .addCase(chronicles.userInactive, state => void (state.skipUids.length = 0));
  }
});

export default recommendedSlice.reducer;

export const { actions } = recommendedSlice;

export const types = Object.fromEntries(new Map(
  Object.values(recommendedSlice.actions).map(a => [a.type, a.type])
));

const getWip                  = state => state.wip;
const getError                = state => state.err;
const getRecommendedItems     = (state, feedName) => (state.feeds[feedName] || []);
const getManyRecommendedItems = (state, feedNames) => feedNames?.reduce((acc, feedName) => {
  acc[feedName] = state.feeds[feedName] || [];
  return acc;
}, {});
const getSkipUids             = state => state.skipUids;
const getViews                = (state, uid) => (state.views[uid] || -1);
const getManyViews            = (state, uids) => uids?.map(uid => (state.views[uid] || -1));
const getWatchingNow          = (state, uid) => (state.watchingNow[uid] || -1);
const getManyWatchingNow      = (state, uids) => uids?.map(uid => (state.watchingNow[uid] || -1));

export const selectors = {
  getWip,
  getError,
  getRecommendedItems,
  getManyRecommendedItems,
  getSkipUids,
  getViews,
  getManyViews,
  getWatchingNow,
  getManyWatchingNow
};
