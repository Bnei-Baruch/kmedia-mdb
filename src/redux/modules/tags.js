import { createAction } from 'redux-actions';
import identity from 'lodash/identity';

import { tracePath, unitsBySection } from '../../helpers/utils';
import { canonicalContentType, canonicalSectionByUnit } from '../../helpers/links';
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
const fetchDashboardSuccess = createAction(FETCH_DASHBOARD_SUCCESS, (id, data) => ({ id, data }));
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
  getByID: identity,
  counts: [],
  sections: [],
  units: [],
  cuBySection: {},
  getSectionUnits: identity
};

const buildById = (items) => {
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
  draft.wip             = false;
  draft.getByID         = identity;
  draft.getPathByID     = () => [];
  draft.counts          = [];
  draft.sections        = [];
  draft.units           = [];
  draft.cuBySection     = {};
  draft.getSectionUnits = identity;

  if (draft.error) {
    draft.error = draft.error.toString();
  }
};

const onReceiveTags = (draft, payload) => {
  const byId = buildById(payload);

  function getByID(id) {
    return byId[id];
  }

  function getPath(source) {
    return tracePath(source, getByID);
  }

  function getPathByID(id) {
    return getPath(getByID(id));
  }

  const roots        = payload.map(x => x.id);
  const displayRoots = roots.filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1);

  draft.byId         = byId;
  // we keep those in state to avoid recreating them every time a selector is called
  draft.getByID      = getByID;
  draft.getPath      = getPath;
  draft.getPathByID  = getPathByID;
  draft.roots        = roots;
  draft.displayRoots = displayRoots;
};

const onDashboard = draft => {
  draft.wip = true;
};

const onDashboardSuccess = (draft, { data }) => {
  const { latest_units: latestUnits, counts /* promoted_units */ } = data;

  if (!Array.isArray(latestUnits)) {
    return;
  }

  // map units to sections
  const cuBySection = unitsBySection(latestUnits);

  const getSectionUnits   = section => cuBySection[section];
  const uniqueSectionsArr = [...new Set(latestUnits.map(u => canonicalSectionByUnit(u)).filter(x => !!x))].sort();

  const getCounts = section => {
    const contentTypes = canonicalContentType(section);
    return contentTypes.map(c => counts[c] || 0).reduce((acc, c) => acc + c) || 0;
  };

  draft.wip             = false;
  draft.error           = null;
  draft.counts          = counts;
  draft.getCounts       = getCounts;
  draft.sections        = uniqueSectionsArr;
  draft.units           = latestUnits;
  draft.cuBySection     = cuBySection;
  draft.getSectionUnits = getSectionUnits;
};

const onSetLanguage = draft => {
  draft.wip             = false;
  draft.getByID         = identity;
  draft.counts          = [];
  draft.sections        = [];
  draft.units           = [];
  draft.cuBySection     = {};
  draft.getSectionUnits = identity;
  draft.err             = null;
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

const getTags         = state => state.byId;
const getRoots        = state => state.roots;
const getCounts       = state => state.getCounts;
const getDisplayRoots = state => state.displayRoots;
const getTagById      = state => state.getByID;
const getPath         = state => state.getPath;
const getPathByID     = state => state.getPathByID;
const getSections     = state => state.sections;
const getUnits        = state => state.units;
const getSectionUnits = state => state.getSectionUnits;
const getWip          = state => state.wip;
const getError        = state => state.error;

export const selectors = {
  getWip,
  getError,
  getTags,
  getRoots,
  getCounts,
  getDisplayRoots,
  getTagById,
  getPath,
  getPathByID,
  getSections,
  getUnits,
  getSectionUnits
};
