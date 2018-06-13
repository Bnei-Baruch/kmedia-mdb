import { createAction, handleActions } from 'redux-actions';
import identity from 'lodash/identity';

import { tracePath } from '../../helpers/utils';
import { canonicalLink } from '../../helpers/links';
import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const FETCH_TAGS         = 'Tags/FETCH_TAGS';
const FETCH_TAGS_SUCCESS = 'Tags/FETCH_TAGS_SUCCESS';
const FETCH_TAGS_FAILURE = 'Tags/FETCH_TAGS_FAILURE';

const FETCH_DASHBOARD         = 'Tags/FETCH_DASHBOARD';
const FETCH_DASHBOARD_SUCCESS = 'Tags/FETCH_DASHBOARD_SUCCESS';
const FETCH_DASHBOARD_FAILURE = 'Tags/FETCH_DASHBOARD_FAILURE';

export const types = {
  FETCH_TAGS,
  FETCH_TAGS_SUCCESS,
  FETCH_TAGS_FAILURE,
  FETCH_DASHBOARD,
  FETCH_DASHBOARD_SUCCESS,
  FETCH_DASHBOARD_FAILURE
};

/* Actions */

const fetchTags        = createAction(FETCH_TAGS);
const fetchTagsSuccess = createAction(FETCH_TAGS_SUCCESS);
const fetchTagsFailure = createAction(FETCH_TAGS_FAILURE);

const fetchDashboard        = createAction(FETCH_DASHBOARD);
const fetchDashboardSuccess = createAction(FETCH_DASHBOARD_SUCCESS, (id, data) => ({id, data}));
const fetchDashboardFailure = createAction(FETCH_DASHBOARD_FAILURE, (id, err) => ({id, err}));

export const actions = {
  fetchTags,
  fetchTagsSuccess,
  fetchTagsFailure,
  fetchDashboard,
  fetchDashboardSuccess,
  fetchDashboardFailure
};

/* Reducer */

const initialState = {
  byId: {},
  roots: [],
  tagIdsByPattern: {},
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
      children: node.children ? node.children.map(x => x.id) : node,
    };
  }

  return byId;
};

const onSSRPrepare = state => ({
  ...initialState,
  error: state.error ? state.error.toString() : state.error,
});

const onFetchTagsSuccess = (state, action) => {
  const byId = buildById(action.payload);

  // selectors
  // we keep those in state to avoid recreating them every time a selector is called
  const getByID     = id => byId[id];
  const getPath     = source => tracePath(source, getByID);
  const getPathByID = id => getPath(getByID(id));

  return {
    ...state,
    byId,
    getByID,
    getPath,
    getPathByID,
    roots: action.payload.map(x => x.id),
    wip: false,
    error: null
  };
}

const onDashboard = () => { 
  return {...initialState, wip: true} 
}

const getSectionOfUnit = (unit) => {
  const s = canonicalLink(unit).split('/');
  return s.length >= 3 ? s[1] : null;
}

const onDashboardSuccess = (state, action) => {
  const { data } = action.payload;
  const { latest_units: latestUnitsArr, promoted_units } = data;

  if(Array.isArray(latestUnitsArr)){
    const uniqueSectionsArr = [...new Set(latestUnitsArr.map(u => getSectionOfUnit(u))
                                                        .filter(x => !!x)
    )].sort(); 

    // map units to sections
    const cuBySection = latestUnitsArr.reduce((acc, u) => {
      const section = getSectionOfUnit(u);
      if (acc[section]) {
        acc[section].push(u);
      } else {
        acc[section] = [u];
      }

      return acc;
    }, {});

    console.log('cuBySection:', cuBySection);

    const getSectionUnits = section => cuBySection[section];

    return {
      ...state,
      wip: false,
      error: null,
      sections: uniqueSectionsArr,
      units: latestUnitsArr,
      cuBySection,
      getSectionUnits
    }
  }
  else{
    return {
      ...state, 
      wip: false, 
      err: 'No latest units were found'
    };
  }
}

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [settings.SET_LANGUAGE]: () => initialState,

  [FETCH_TAGS_SUCCESS]: onFetchTagsSuccess,

  [FETCH_TAGS_FAILURE]: (state, action) => ({...state, error: action.payload }),

  [FETCH_DASHBOARD]: onDashboard,

  [FETCH_DASHBOARD_SUCCESS]: onDashboardSuccess,

  [FETCH_DASHBOARD_FAILURE]: (state, action) => ({...state, error: action.payload.err }),

}, initialState);

/* Selectors */

const getTags     = state => state.byId;
const getRoots    = state => state.roots;
const getTagById  = state => state.getByID;
const getPath     = state => state.getPath;
const getPathByID = state => state.getPathByID;
const getSections = state => state.sections;
const getUnits = state => state.units;
const getSectionUnits = state => state.getSectionUnits;

export const selectors = {
  getTags,
  getRoots,
  getTagById,
  getPath,
  getPathByID,
  getSections,
  getUnits,
  getSectionUnits
};

