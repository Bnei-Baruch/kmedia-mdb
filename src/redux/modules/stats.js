import { createAction } from 'redux-actions';

import { types as ssr } from './ssr';
import { handleActions } from './settings';

/* Types */

const FETCH_CU_STATS         = 'Stats/FETCH_CU_STATS';
const FETCH_CU_STATS_SUCCESS = 'Stats/FETCH_CU_STATS_SUCCESS';
const FETCH_CU_STATS_FAILURE = 'Stats/FETCH_CU_STATS_FAILURE';
const CLEAR_CU_STATS         = 'Stats/CLEAR_CU_STATS';

export const types = {
  FETCH_CU_STATS,
  FETCH_CU_STATS_SUCCESS,
  FETCH_CU_STATS_FAILURE,
  CLEAR_CU_STATS
};

/* Actions */

const fetchCUStats        = createAction(FETCH_CU_STATS, (namespace, params = {}) => ({ namespace, ...params }));
const fetchCUStatsSuccess = createAction(FETCH_CU_STATS_SUCCESS, (namespace, data) => ({ namespace, data }));
const fetchCUStatsFailure = createAction(FETCH_CU_STATS_FAILURE, (namespace, err) => ({ namespace, err }));
const clearCUStats        = createAction(CLEAR_CU_STATS, namespace => ({ namespace }));
export const actions      = {
  fetchCUStats,
  fetchCUStatsSuccess,
  fetchCUStatsFailure,
  clearCUStats
};

/* Reducer */

const initialState = {
  cuStats: {},
};

const onCURequest = (state, action) => ({
  ...state,
  cuStats: {
    ...state.cuStats,
    [action.namespace]: {
      ...(state.cuStats[action.namespace] || {}),
      wip: true,
    }
  }
});

const onCUFailure = (state, action) => ({
  ...state,
  cuStats: {
    ...state.cuStats,
    [action.payload.namespace]: {
      ...(state.cuStats[action.payload.namespace] || {}),
      wip: false,
      err: action.payload.err,
    }
  }
});

const onCUSuccess = (draft, payload) => {
  if (draft.cuStats[payload.namespace] === undefined) {
    draft.cuStats[payload.namespace] = {};
  }

  draft.cuStats[payload.namespace].wip  = false;
  draft.cuStats[payload.namespace].data = payload.data;
};

const onClearCUStats = (draft, payload) => {
  draft.cuStats[payload.namespace] = {};
};

const onSSRPrepare = draft => {
  Object.keys(draft.cuStats).forEach(namespace => {
    if (draft.cuStats[namespace].err) {
      draft.cuStats[namespace].err = draft.cuStats[namespace].err.toString;
    }
  });
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [FETCH_CU_STATS]: onCURequest,
  [FETCH_CU_STATS_SUCCESS]: onCUSuccess,
  [FETCH_CU_STATS_FAILURE]: onCUFailure,
  [CLEAR_CU_STATS]: onClearCUStats,
}, initialState);

/* Selectors */

const getCUStats = (state, namespace) => state.cuStats[namespace] || {};

export const selectors = {
  getCUStats,
};
