import { createSlice } from '@reduxjs/toolkit';
import { actions as settingsActions } from './settings';
import { actions as ssrActions } from './ssr';
import isEqual from 'react-fast-compare';

const initialState = {
  latestLesson    : null,
  latestUnits     : null,
  latestCos       : null,
  fetchedTimestamp: null,
  banners         : {
    data: {},
    wip : false,
    err : null
  },
  wip             : false,
  err             : null
};

const onSetLanguages = state => {
  state.latestLesson     = null;
  state.latestUnits      = null;
  state.fetchedTimestamp = null;
  state.banners          = {
    data: {},
    wip : false,
    err : null
  };
  state.wip              = false;
  state.err              = null;
};

const onDataSuccess = (state, { payload }) => {
  const { id }      = payload.latest_daily_lesson;
  const latestUnits = payload.latest_units.map(x => x.id);
  const latestCos   = payload.latest_cos.map(x => x.id);

  if (state.latestLesson !== id || !isEqual(state.latestLesson, latestUnits) || !isEqual(state.latestCos, latestCos)) {
    state.wip            = false;
    state.err            = null;
    state.latestLesson   = id;
    state.latestUnits    = latestUnits;
    state.latestCos      = latestCos;
    state.fetchedTimestamp = Date.now();
  }

  return state;
};

const onDataFailure = (state, { payload }) => {
  state.wip  = false;
  state.data = null;
  state.err  = payload;
};

const onFetchBanners = state => {
  state.banners.wip  = true;
  state.banners.data = {
    data: {},
    wip : false,
    err : null
  };
};

const onFetchBannersSuccess = (state, { payload }) => {
  if (payload.length === 0) {
    // empty result
    onFetchBannersFailure(state, { payload });
    return;
  }

  state.banners.wip  = false;
  state.banners.err  = null;
  state.banners.data = payload;
};

const onFetchBannersFailure = (state, { payload }) => {
  state.banners.wip  = false;
  state.banners.data = {};
  state.banners.err  = payload.message;
};

const onSSRPrepare = state => {
  if (state.err) {
    state.err = state.err.toString();
  }
};

const homeSlice = createSlice({
  name: 'home',
  initialState,

  reducers     : {
    fetchData       : (state, action) => {
      if (action.payload) {
        state.wip = true;
      }
    },
    fetchDataSuccess: onDataSuccess,
    fetchDataFailure: onDataFailure,

    fetchBanners       : onFetchBanners,
    fetchBannersSuccess: onFetchBannersSuccess,
    fetchBannersFailure: onFetchBannersFailure
  },
  extraReducers: builder => {
    builder
      .addCase(ssrActions.prepare, onSSRPrepare)
      .addCase(settingsActions.setContentLanguages, onSetLanguages);
  }
});

export default homeSlice.reducer;

export const { actions } = homeSlice;

export const types = Object.fromEntries(new Map(
  Object.values(homeSlice.actions).map(a => [a.type, a.type])
));

/* Selectors */

const getLatestLesson   = state => state.latestLesson;
const getLatestUnits    = state => state.latestUnits;
const getLatestCos      = state => state.latestCos;
const getFetchTimestamp = state => state.fetchedTimestamp;
const getBanner         = state => state.banners;
const getWip            = state => state.wip;
const getError          = state => state.err;

export const selectors = {
  getLatestLesson,
  getLatestUnits,
  getLatestCos,
  getFetchTimestamp,
  getBanner,
  getWip,
  getError
};
