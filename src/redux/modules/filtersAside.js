import { createAction } from 'redux-actions';

import { handleActions } from './settings';

/* Types */

const FETCH_STATS         = 'Filters_aside/FETCH_STATS';
const FETCH_STATS_FAILURE = 'Filters_aside/FETCH_STATS_FAILURE';
const FETCH_STATS_SUCCESS = 'Filters_aside/FETCH_STATS_SUCCESS';

export const types = {
  FETCH_STATS,
  FETCH_STATS_FAILURE,
  FETCH_STATS_SUCCESS,
};

/* Actions */

const fetchStats        = createAction(FETCH_STATS, (namespace, params, isPrepare) => ({
  namespace,
  params,
  isPrepare
}));
const fetchStatsSuccess = createAction(FETCH_STATS_SUCCESS);
const fetchStatsFailure = createAction(FETCH_STATS_FAILURE);

export const actions = {
  fetchStats,
  fetchStatsSuccess,
  fetchStatsFailure,
};

/* Reducer */

const initialState = {
  sources: { tree: [], byId: {} },
};

const onFetchStats = (draft, { namespace }) => {
  const sourcesNS          = draft.sources[namespace] || {};
  sourcesNS.wip            = true;
  sourcesNS.err            = null;
  draft.sources[namespace] = sourcesNS;
  return draft;
};

const onFetchStatsSuccess = (draft, { data: { sources }, namespace, isPrepare }) => {
  let acc = draft.sources[namespace];

  if (isPrepare) {
    acc.tree = [];
    acc.byId = {};
    Object.keys(sources).filter(id => !!id).forEach(id => {
      acc.byId[id] = sources[id];
      acc.tree.push(id);
    });
  } else {
    draft.sources[namespace].tree.forEach(id => {
      acc.byId[id] = sources[id] || 0;
    });
  }
  draft.sources[namespace] = { ...acc, wip: false, err: null };
  return draft;
};

const onFetchStatsFailure = (draft, ns, err) => {
  draft.tree[ns].wip = false;
  draft.tree[ns].err = err;
  return draft;
};

export const reducer = handleActions({
  [FETCH_STATS]: onFetchStats,
  [FETCH_STATS_SUCCESS]: onFetchStatsSuccess,
  [FETCH_STATS_FAILURE]: onFetchStatsFailure,

}, initialState);

/* Selectors */
const getStats  = (state, ns, id) => state.sources[ns]?.byId[id] || '0';
const getTree   = (state, ns) => state.sources[ns]?.tree || [];
const isReady   = (state, ns) => !!state.sources[ns]?.tree;
const getWipErr = (state, ns) => ({ wip: state.sources[ns]?.wip || false, err: state.sources[ns]?.err || null });

export const selectors = {
  getStats,
  getTree,
  isReady,
  getWipErr,
};
