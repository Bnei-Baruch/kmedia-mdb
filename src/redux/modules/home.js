import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */
const FETCH_DATA         = 'Home/FETCH_DATA';
const FETCH_DATA_SUCCESS = 'Home/FETCH_DATA_SUCCESS';
const FETCH_DATA_FAILURE = 'Home/FETCH_DATA_FAILURE';

export const types = {
  FETCH_DATA,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
};

/* Actions */

const fetchData        = createAction(FETCH_DATA);
const fetchDataSuccess = createAction(FETCH_DATA_SUCCESS);
const fetchDataFailure = createAction(FETCH_DATA_FAILURE);

export const actions = {
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
};

/* Reducer */

const initialState = {
  latestLesson: null,
  latestUnits: null,
  banner: null,
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
  banner: action.payload.banner,
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
