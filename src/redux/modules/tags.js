import { createAction } from 'redux-actions';

import { tracePath } from '../../helpers/utils';
import { TOPICS_FOR_DISPLAY } from '../../helpers/consts';
import { handleActions, types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const RECEIVE_TAGS = 'Tags/RECEIVE_TAGS';

const FETCH_DASHBOARD         = 'Tags/FETCH_DASHBOARD';
const FETCH_DASHBOARD_SUCCESS = 'Tags/FETCH_DASHBOARD_SUCCESS';
const FETCH_DASHBOARD_FAILURE = 'Tags/FETCH_DASHBOARD_FAILURE';
const FETCH_STATS             = 'Tags/FETCH_STATS';
const FETCH_STATS_SUCCESS     = 'Tags/FETCH_STATS_SUCCESS';
const FETCH_STATS_FAILURE     = 'Tags/FETCH_STATS_FAILURE';

export const types = {
  RECEIVE_TAGS,
  FETCH_DASHBOARD,
  FETCH_DASHBOARD_SUCCESS,
  FETCH_DASHBOARD_FAILURE,
  FETCH_STATS,
  FETCH_STATS_SUCCESS,
  FETCH_STATS_FAILURE
};

/* Actions */

const receiveTags = createAction(RECEIVE_TAGS);

const fetchDashboard        = createAction(FETCH_DASHBOARD);
const fetchDashboardSuccess = createAction(FETCH_DASHBOARD_SUCCESS);
const fetchDashboardFailure = createAction(FETCH_DASHBOARD_FAILURE, (id, err) => ({ id, err }));
const fetchStats            = createAction(FETCH_STATS, (namespace, contentTypes) => ({ namespace, contentTypes }));
const fetchStatsSuccess     = createAction(FETCH_STATS_SUCCESS);
const fetchStatsFailure     = createAction(FETCH_STATS_FAILURE);

export const actions = {
  receiveTags,
  fetchDashboard,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  fetchStats,
  fetchStatsSuccess,
  fetchStatsFailure
};

/* Reducer */

const initialState = {
  wip: false,
  error: null,
  dashboard: { items: [], mediaTotal: 0, textTotal: 0 },
  loaded: false,
};

const buildById = items => {
  const byId = {};

  // We BFS the tree, extracting each item by it's ID
  // and normalizing it's children
  let s = [...items];
  while (s.length > 0) {
    const node = s.pop();
    if (node.children) {
      s = s.concat(node.children);
    }

    byId[node.id] = {
      ...node,
      children: node.children ? node.children.map(x => x.id) : [],
    };
  }

  return byId;
};

const onSSRPrepare = draft => {
  draft.wip       = false;
  draft.loaded    = false;
  draft.dashboard = { items: [], mediaTotal: 0, textTotal: 0 };

  if (draft.error) {
    draft.error = draft.error.toString();
  }
};

const onReceiveTags = (draft, payload) => {
  const byId = buildById(payload);

  const roots        = payload.map(x => x.id);
  const displayRoots = roots.filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1);

  draft.byId         = byId;
  draft.roots        = roots;
  draft.displayRoots = displayRoots;
  draft.loaded       = true;
};

const onDashboard = draft => {
  draft.wip = true;
};

const onDashboardSuccess = (draft, { items = [], mediaTotal, textTotal }) => {
  draft.wip       = false;
  draft.error     = null;
  draft.dashboard = { items, mediaTotal, textTotal };
};

const onSetLanguage = draft => {
  draft.loaded = false;
  draft.wip    = false;
  draft.err    = null;
};

const onFetchDashboardFailure = (draft, payload) => {
  draft.wip   = false;
  draft.error = payload.err;
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_DASHBOARD]: onDashboard,
  [FETCH_DASHBOARD_SUCCESS]: onDashboardSuccess,
  [FETCH_DASHBOARD_FAILURE]: onFetchDashboardFailure,

  [RECEIVE_TAGS]: onReceiveTags

}, initialState);

/* Selectors */

const areTagsLoaded   = state => state.loaded;
const getTags         = state => state.byId;
const getRoots        = state => state.roots;
const getDisplayRoots = state => state.displayRoots;
const getTagById      = state => id => state.byId[id];
const getPath         = state => source => tracePath(source, getTagById(state));
const getPathByID     = state => {
  const _byId = getTagById(state);
  return id => tracePath(_byId(id), _byId);
};

const getWip          = state => state.wip;
const getError        = state => state.error;

const getItems = state => state.dashboard || {};

export const selectors = {
  areTagsLoaded,
  getWip,
  getError,
  getTags,
  getRoots,
  getDisplayRoots,
  getTagById,
  getPath,
  getPathByID,
  getItems
};
