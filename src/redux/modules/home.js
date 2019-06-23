import { createAction } from 'redux-actions';

import { handleActions, types as settings } from './settings';
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

const onSetLanguage = (draft) => {
  draft.latestLesson = null;
  draft.latestUnits  = null;
  draft.banner       = null;
  draft.wip          = false;
  draft.err          = null;
};

const onData = (draft, payload) => {
  draft.wip          = false;
  draft.err          = null;
  draft.latestLesson = payload.latest_daily_lesson.id;
  draft.latestUnits  = payload.latest_units.map(x => x.id);
  draft.banner       = payload.banner;
};

const onDataFailure = (draft, payload) => {
  draft.wip  = false;
  draft.data = null;
  draft.err  = payload;
};

const onSSRPrepare = draft => {
  if (draft.err) {
    draft.err = draft.err.toString();
  }
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_DATA]: draft => {
    draft.wip = true;
  },
  [FETCH_DATA_SUCCESS]: onData,
  [FETCH_DATA_FAILURE]: onDataFailure,
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
