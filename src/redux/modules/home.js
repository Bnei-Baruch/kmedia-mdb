import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */
const FETCH_DATA           = 'Home/FETCH_DATA';
const FETCH_DATA_SUCCESS   = 'Home/FETCH_DATA_SUCCESS';
const FETCH_DATA_FAILURE   = 'Home/FETCH_DATA_FAILURE';
const FETCH_BANNER         = 'Assets/FETCH_BANNER';
const FETCH_BANNER_SUCCESS = 'Assets/FETCH_BANNER_SUCCESS';
const FETCH_BANNER_FAILURE = 'Assets/FETCH_BANNER_FAILURE';

export const types = {
  FETCH_DATA,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  FETCH_BANNER,
  FETCH_BANNER_SUCCESS,
  FETCH_BANNER_FAILURE,
};

/* Actions */

const fetchData          = createAction(FETCH_DATA);
const fetchDataSuccess   = createAction(FETCH_DATA_SUCCESS);
const fetchDataFailure   = createAction(FETCH_DATA_FAILURE);
const fetchBanner        = createAction(FETCH_BANNER);
const fetchBannerSuccess = createAction(FETCH_BANNER_SUCCESS);
const fetchBannerFailure = createAction(FETCH_BANNER_FAILURE);

export const actions = {
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
  fetchBanner,
  fetchBannerSuccess,
  fetchBannerFailure,
};

/* Reducer */

const initialState = {
  latestLesson: null,
  latestUnits: null,
  banner: {
    data: {},
    wip: false,
    err: null,
  },
  wip: false,
  err: null,
};

const onSetLanguage = () => ({
  ...initialState,
});

const onData = (state, action) => ({
  ...state,
  wip: false,
  err: null,
  latestLesson: action.payload.latest_daily_lesson.id,
  latestUnits: action.payload.latest_units.map(x => x.id),
});

const onSSRPrepare = state => ({
  ...state,
  err: state.err ? state.err.toString() : state.err,
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_DATA]: state => ({ ...state, wip: true }),
  [FETCH_DATA_SUCCESS]: onData,
  [FETCH_DATA_FAILURE]: (state, action) => ({ ...state, wip: false, data: null, err: action.payload }),

  [FETCH_BANNER]: state => ({
    ...state,
    banner: { wip: true, data: {} }
  }),

  [FETCH_BANNER_SUCCESS]: (state, action) => ({
    ...state,
    banner: { data: action.payload.content, wip: false, err: null }
  }),

  [FETCH_BANNER_FAILURE]: (state, action) => ({
    ...state,
    banner: { wip: false, err: action.payload }
  }),
}, initialState);

/* Selectors */

const getLatestLesson = state => state.latestLesson;
const getLatestUnits  = state => state.latestUnits;
const getBanner       = state => state.banner;
const getWip          = state => state.wip;
const getError        = state => state.err;

export const selectors = {
  getLatestLesson,
  getLatestUnits,
  getBanner,
  getWip,
  getError,
};
