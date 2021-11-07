import { createAction } from 'redux-actions';

import { handleActions, types as settings } from './settings';
import { types as ssr } from './ssr';
import isEqual from 'react-fast-compare';

/* Types */
const FETCH_DATA           = 'Home/FETCH_DATA';
const FETCH_DATA_SUCCESS   = 'Home/FETCH_DATA_SUCCESS';
const FETCH_DATA_FAILURE   = 'Home/FETCH_DATA_FAILURE';
const FETCH_BANNER         = 'Home/FETCH_BANNER';
const FETCH_BANNER_SUCCESS = 'Home/FETCH_BANNER_SUCCESS';
const FETCH_BANNER_FAILURE = 'Home/FETCH_BANNER_FAILURE';

export const types = {
  FETCH_DATA,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  FETCH_BANNER,
  FETCH_BANNER_SUCCESS,
  FETCH_BANNER_FAILURE,
};

/* Actions */

const fetchData           = createAction(FETCH_DATA);
const fetchDataSuccess    = createAction(FETCH_DATA_SUCCESS);
const fetchDataFailure    = createAction(FETCH_DATA_FAILURE);
const fetchBanners        = createAction(FETCH_BANNER);
const fetchBannersSuccess = createAction(FETCH_BANNER_SUCCESS);
const fetchBannersFailure = createAction(FETCH_BANNER_FAILURE);

export const actions = {
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
  fetchBanners,
  fetchBannersSuccess,
  fetchBannersFailure,
};

/* Reducer */

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

const onSetLanguage = draft => {
  draft.latestLesson = null;
  draft.latestUnits  = null;
  draft.banners      = {
    data: {},
    wip: false,
    err: null,
  };
  draft.wip          = false;
  draft.err          = null;
};

const onData = (draft, payload) => {
  if (payload) {
    draft.wip = true;
  }
};

const onDataSuccess = (draft, payload) => {
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

const onDataFailure = (draft, payload) => {
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

const onFetchBannersSuccess = (draft, payload) => {
  if (payload.length === 0) {
    // empty result
    onFetchBannersFailure(draft, payload);
    return;
  }

  draft.banners.wip  = false;
  draft.banners.err  = null;
  draft.banners.data = payload;
};

const onFetchBannersFailure = (draft, payload) => {
  draft.banners.wip  = false;
  draft.banners.data = {};
  draft.banners.err  = payload;
};

const onSSRPrepare = draft => {
  if (draft.err) {
    draft.err = draft.err.toString();
  }
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_DATA]: onData,
  [FETCH_DATA_SUCCESS]: onDataSuccess,
  [FETCH_DATA_FAILURE]: onDataFailure,

  [FETCH_BANNER]: onFetchBanners,
  [FETCH_BANNER_SUCCESS]: onFetchBannersSuccess,
  [FETCH_BANNER_FAILURE]: onFetchBannersFailure,
}, initialState);

/* Selectors */

const getLatestLesson = state => state.latestLesson;
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
