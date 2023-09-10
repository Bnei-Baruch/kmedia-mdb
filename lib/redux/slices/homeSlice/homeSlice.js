import { createSlice } from '@reduxjs/toolkit';

import { HYDRATE } from 'next-redux-wrapper';
import { fetchData, fetchBanners } from '@/lib/redux/slices/homeSlice/thunks';

/* Instruments */

const initialState = {
  latestLesson: null,
  latestUnits: null,
  banners: {
    data: {},
    wip: false,
    err: null,
  },
  wip: false,
  err: null,
};

/*const onSetLanguages = draft => {
  draft.latestLesson = null;
  draft.latestUnits  = null;
  draft.banners      = {
    data: {},
    wip: false,
    err: null,
  };
  draft.wip          = false;
  draft.err          = null;
};*/

const onData = (draft, payload) => {
  if (payload) {
    draft.wip = true;
  }
};

const onDataSuccess = (draft, { payload }) => {
  const { id }      = payload.latest_daily_lesson;
  const latestUnits = payload.latest_units.map(x => x.id);
  const latestCos   = payload.latest_cos.map(x => x.id);

  if (draft.latestLesson !== id || !isEqual(draft.latestLesson, latestUnits) || !isEqual(draft.latestCos, latestCos)) {
    draft.wip          = false;
    draft.err          = null;
    draft.latestLesson = id;
    draft.latestUnits  = latestUnits;
    draft.latestCos    = latestCos;
  }

  return draft;
};

const onDataFailure = (draft, { payload }) => {
  draft.wip  = false;
  draft.data = null;
  draft.err  = payload;
};

const onFetchBanners = draft => {
  draft.banners.wip  = true;
  draft.banners.data = {
    data: {},
    wip: false,
    err: null,
  };
};

const onFetchBannersSuccess = (draft, { payload }) => {
  if (payload.length === 0) {
    // empty result
    onFetchBannersFailure(draft, { payload });
    return;
  }

  draft.banners.wip  = false;
  draft.banners.err  = null;
  draft.banners.data = payload;
};

const onFetchBannersFailure = (draft, { error }) => {
  draft.banners.wip  = false;
  draft.banners.data = {};
  draft.banners.err  = error?.message || null;
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: { fetchData: onData, fetchBanners: onFetchBanners },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, onDataSuccess);
    builder.addCase(fetchData.rejected, onDataFailure);
    builder.addCase(fetchBanners.fulfilled, onFetchBannersSuccess);
    builder.addCase(fetchBanners.rejected, onFetchBannersFailure);
    builder.addCase(HYDRATE, (state, action) => ({ ...state, ...action.payload.home, }));
  }
});

/* Selectors */

const getLatestLesson = state => {
  return state.latestLesson;
};
const getLatestUnits  = state => state.latestUnits;
const getLatestCos    = state => state.latestCos;
const getBanner       = state => state.banners;
const getWip          = state => state.wip;
const getError        = state => state.err;

export const selectors = {
  getLatestLesson,
  getLatestUnits,
  getLatestCos,
  getBanner,
  getWip,
  getError,
};
