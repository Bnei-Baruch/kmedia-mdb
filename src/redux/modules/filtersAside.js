import { createAction } from 'redux-actions';
import {
  FN_COLLECTION_MULTI,
  FN_CONTENT_TYPE,
  FN_LANGUAGES,
  FN_LOCATIONS,
  FN_MEDIA_TYPE,
  FN_ORIGINAL_LANGUAGES,
  FN_PERSON,
  FN_SOURCES_MULTI,
  FN_TOPICS_MULTI
} from '../../helpers/consts';

import { handleActions } from './settings';

const fieldNameByFilter = {
  [FN_SOURCES_MULTI]: 'sources',
  [FN_TOPICS_MULTI]: 'tags',
  [FN_CONTENT_TYPE]: 'content_types',
  [FN_LANGUAGES]: 'languages',
  [FN_COLLECTION_MULTI]: 'collections',
  [FN_PERSON]: 'persons',
  [FN_MEDIA_TYPE]: 'media_types',
  [FN_ORIGINAL_LANGUAGES]: 'original_languages',
};

const FILTER_NAMES = [
  FN_TOPICS_MULTI,
  FN_SOURCES_MULTI,
  FN_CONTENT_TYPE,
  FN_LANGUAGES,
  FN_COLLECTION_MULTI,
  FN_PERSON,
  FN_MEDIA_TYPE,
  FN_ORIGINAL_LANGUAGES,
];
/* Types */

const FETCH_STATS               = 'Filters_aside/FETCH_STATS';
const FETCH_STATS_FAILURE       = 'Filters_aside/FETCH_STATS_FAILURE';
const FETCH_STATS_SUCCESS       = 'Filters_aside/FETCH_STATS_SUCCESS';
const RECEIVE_SINGLE_TYPE_STATS = 'Filters_aside/RECEIVE_SINGLE_TYPE_STATS';
const RECEIVE_LOCATIONS_STATS   = 'Filters_aside/RECEIVE_LOCATIONS_STATS';

export const types = {
  FETCH_STATS,
  FETCH_STATS_FAILURE,
  FETCH_STATS_SUCCESS,
};

/* Actions */

const fetchStats             = createAction(FETCH_STATS, (namespace, params, options = {}) => ({
  namespace,
  params,
  options
}));
const fetchStatsSuccess      = createAction(FETCH_STATS_SUCCESS);
const receiveSingleTypeStats = createAction(RECEIVE_SINGLE_TYPE_STATS);
const fetchStatsFailure      = createAction(FETCH_STATS_FAILURE);
const receiveLocationsStats  = createAction(RECEIVE_LOCATIONS_STATS);

export const actions = {
  fetchStats,
  fetchStatsSuccess,
  receiveSingleTypeStats,
  fetchStatsFailure,
  receiveLocationsStats,
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

const onFetchStatsSuccess = (draft, { dataCU, dataC, dataL, namespace, isPrepare }) => {
  const ns = draft[namespace] || FILTER_NAMES.reduce((acc, fn) => {
    acc[fn] = {};
    return acc;
  }, {});

  FILTER_NAMES.forEach(fn => {
    const acc = ns[fn] || { tree: [], byId: {} };
    const dcu = dataCU[fieldNameByFilter[fn]] || {};
    const dc  = dataC[fieldNameByFilter[fn]] || {};
    const dl  = dataL[fieldNameByFilter[fn]] || {};
    if (isPrepare) {
      [...Object.keys({ ...dcu, ...dc, ...dl })]
        .filter(id => !!id)
        .forEach(id => {
          acc.byId[id] = (dcu[id] || 0) + (dc[id] || 0) + (dl[id] || 0);
          acc.tree.push(id);
        });
    } else {
      acc.tree.forEach(id => {
        acc.byId[id] = (dcu[id] || 0) + (dc[id] || 0) + (dl[id] || 0);
      });
    }

    ns[fn] = acc;
  });

  draft[namespace] = { ...ns, wip: false, err: null, isReady: true };
  return draft;
};

const onReceiveSingleTypeStats = (draft, { dataCU = {}, dataC = {}, dataL = {}, namespace, isPrepare, fn }) => {
  const statsByFN = draft[namespace]?.[fn] || {};

  if (isPrepare) {
    [...Object.keys({ ...dataCU, ...dataC, ...dataL })]
      .filter(id => !!id)
      .forEach(id => {
        statsByFN.byId[id] = (dataCU[id] || 0) + (dataC[id] || 0) + (dataL[id] || 0);
        statsByFN.tree.push(id);
      });
  } else {
    statsByFN.tree.forEach(id => {
      statsByFN.byId[id] = (dataCU[id] || 0) + (dataC[id] || 0) + (dataL[id] || 0);
    });
  }

  draft[namespace] = { ...draft[namespace], [fn]: statsByFN };
  return draft;
};

const onReceiveLocationsStats = (draft, { locations, namespace, isPrepare }) => {
  const stats = draft[namespace]?.[FN_LOCATIONS] || { byId: {}, citiesByCountry: {}, tree: [] };

  if (isPrepare) {
    Object.values(locations)
      .filter(x => !!x.city)
      .forEach(({ city, country, count }) => {
        stats.byId[city] = count;
        if (!stats.citiesByCountry[country]) {
          stats.citiesByCountry[country] = [];
          stats.tree.push(country);
        }
        stats.citiesByCountry[country].push(city);
      });
  } else {
    Object.keys(stats.byId).forEach(id => {
      if (!stats.citiesByCountry[id])
        stats.byId[id] = locations[id]?.count || 0;
    });
  }

  console.log('111', stats.byId['Israel']);
  for (const k in stats.citiesByCountry) {
    const c       = stats.citiesByCountry[k].reduce((acc, v) => acc + stats.byId[v], 0);
    stats.byId[k] = c;
  }
  console.log('222', stats.byId['Israel']);
  draft[namespace] = { ...draft[namespace], [FN_LOCATIONS]: stats };
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
  [RECEIVE_SINGLE_TYPE_STATS]: onReceiveSingleTypeStats,
  [FETCH_STATS_FAILURE]: onFetchStatsFailure,
  [RECEIVE_LOCATIONS_STATS]: onReceiveLocationsStats,

}, initialState);

/* Selectors */
const getStats      = (state, ns, fn) => id => state[ns]?.[fn]?.byId[id] || 0;
const getTree       = (state, ns, fn) => state[ns]?.[fn]?.tree || [];
const isReady       = (state, ns) => !!state[ns]?.isReady;
const getWipErr     = (state, ns) => ({ wip: state[ns]?.wip || false, err: state[ns]?.err || null });
const cityByCountry = (state, ns) => id => state[ns]?.[FN_LOCATIONS]?.citiesByCountry[id] || 0;

export const selectors = {
  getStats,
  getTree,
  isReady,
  getWipErr,
  cityByCountry,
};
