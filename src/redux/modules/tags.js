import { createAction, handleActions } from 'redux-actions';
import identity from 'lodash/identity';

import { tracePath } from '../../helpers/utils';
import { canonicalLink } from '../../helpers/links';
import { TOPICS_FOR_DISPLAY } from '../../helpers/consts';
import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const RECEIVE_TAGS = 'Tags/RECEIVE_TAGS';

const FETCH_DASHBOARD         = 'Tags/FETCH_DASHBOARD';
const FETCH_DASHBOARD_SUCCESS = 'Tags/FETCH_DASHBOARD_SUCCESS';
const FETCH_DASHBOARD_FAILURE = 'Tags/FETCH_DASHBOARD_FAILURE';

export const types = {
  RECEIVE_TAGS,
  FETCH_DASHBOARD,
  FETCH_DASHBOARD_SUCCESS,
  FETCH_DASHBOARD_FAILURE
};

/* Actions */

const receiveTags = createAction(RECEIVE_TAGS);

const fetchDashboard        = createAction(FETCH_DASHBOARD);
const fetchDashboardSuccess = createAction(FETCH_DASHBOARD_SUCCESS, (id, data) => ({ id, data }));
const fetchDashboardFailure = createAction(FETCH_DASHBOARD_FAILURE, (id, err) => ({ id, err }));

export const actions = {
  receiveTags,
  fetchDashboard,
  fetchDashboardSuccess,
  fetchDashboardFailure
};

/* Reducer */

const initialState = {
  wip: false,
  error: null,
  getByID: identity,
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

const onSSRPrepare = state => ({
  ...initialState,
  error: state.error ? state.error.toString() : state.error,
});

const onReceiveTags = (state, action) => {
  const byId = buildById(action.payload);

  // we keep those in state to avoid recreating them every time a selector is called
  const getByID     = id => byId[id];
  const getPath     = source => tracePath(source, getByID);
  const getPathByID = id => getPath(getByID(id));

  const roots = action.payload.map(x => x.id);
  const displayRoots = roots.filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1);

  return {
    ...state,
    byId,
    getByID,
    getPath,
    getPathByID,
    roots,
    displayRoots,
  };
};

const getSectionOfUnit = (unit) => {
  const s = canonicalLink(unit).split('/');
  return s.length >= 3 ? s[1] : null;
};

const onDashboard = state => ({
  ...state,
  wip: true
});

const onDashboardSuccess = (state, action) => {
  const { data }                                           = action.payload;
  const { latest_units: latestUnits /* promoted_units */ } = data;

  if (Array.isArray(latestUnits)) {
    // map units to sections
    const cuBySection = latestUnits.reduce((acc, u) => {
      const section = getSectionOfUnit(u);
      if (acc[section]) {
        acc[section].push(u);
      } else {
        acc[section] = [u];
      }

      return acc;
    }, {});

    const getSectionUnits = section => cuBySection[section];
    const uniqueSectionsArr = [...new Set(latestUnits.map(u => getSectionOfUnit(u)).filter(x => !!x))].sort();

    return {
      ...state,
      wip: false,
      error: null,
      sections: uniqueSectionsArr,
      units: latestUnits,
      cuBySection,
      getSectionUnits
    };
  }

  return null;
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: () => initialState,

  [FETCH_DASHBOARD]: onDashboard,
  [FETCH_DASHBOARD_SUCCESS]: onDashboardSuccess,
  [FETCH_DASHBOARD_FAILURE]: (state, action) => ({ ...state, wip: false, error: action.payload.err }),

  [RECEIVE_TAGS]: onReceiveTags

}, initialState);

/* Selectors */

const getTags         = state => state.byId;
const getRoots        = state => state.roots;
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
  getDisplayRoots,
  getTagById,
  getPath,
  getPathByID,
  getSections,
  getUnits,
  getSectionUnits
};
