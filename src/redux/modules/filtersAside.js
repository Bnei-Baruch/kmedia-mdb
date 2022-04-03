import { createAction } from 'redux-actions';

import { handleActions } from './settings';
import { FN_CONTENT_TYPE, FN_LANGUAGES, FN_SOURCES_MULTI, FN_TOPICS_MULTI } from '../../helpers/consts';

const fieldNameByFilter = {
  [FN_SOURCES_MULTI]: 'sources',
  [FN_TOPICS_MULTI]: 'tags',
  [FN_CONTENT_TYPE]: 'content_types',
  [FN_LANGUAGES]: 'languages',
};

const FILTER_NAMES = [FN_TOPICS_MULTI, FN_SOURCES_MULTI, FN_CONTENT_TYPE, FN_LANGUAGES];
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

const initialState = {};

const onFetchStats = (draft, { namespace }) => {
  const ns         = draft[namespace] || {};
  ns.wip           = true;
  ns.err           = null;
  draft[namespace] = ns;
  return draft;
};

const onFetchStatsSuccess = (draft, { dataCU, dataL, namespace, isPrepare }) => {
  const ns = draft[namespace] || FILTER_NAMES.reduce((acc, fn) => {
    acc[fn] = {};
    return acc;
  }, {});

  FILTER_NAMES.forEach(fn => {
    const acc = ns[fn] || { tree: [], byId: {} };
    const dcu = dataCU[fieldNameByFilter[fn]] || {};
    const dl  = dataL[fieldNameByFilter[fn]] || {};
    if (isPrepare) {
      [...Object.keys({ ...dcu, ...dl })]
        .filter(id => !!id)
        .forEach(id => {
          acc.byId[id] = (dcu[id] || 0) + (dl[id] || 0);
          acc.tree.push(id);
        });
    } else {
      acc.tree.forEach(id => {
        acc.byId[id] = (dcu[id] || 0) + (dl[id] || 0);
      });
    }

    ns[fn] = acc;
  });

  draft[namespace] = { ...ns, wip: false, err: null, isReady: true };
  return draft;
};

const onFetchStatsFailure = (draft, ns, err) => {
  draft[ns].wip = false;
  draft[ns].err = err;
  return draft;
};

export const reducer = handleActions({
  [FETCH_STATS]: onFetchStats,
  [FETCH_STATS_SUCCESS]: onFetchStatsSuccess,
  [FETCH_STATS_FAILURE]: onFetchStatsFailure,

}, initialState);

/* Selectors */
const getStats  = (state, ns, fn, id) => state[ns]?.[fn]?.byId[id] || 0;
const getTree   = (state, ns, fn) => state[ns]?.[fn]?.tree || [];
const isReady   = (state, ns) => !!state[ns]?.isReady;
const getWipErr = (state, ns) => ({ wip: state[ns]?.wip || false, err: state[ns]?.err || null });

export const selectors = {
  getStats,
  getTree,
  isReady,
  getWipErr,
};
