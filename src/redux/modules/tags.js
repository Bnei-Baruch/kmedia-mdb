import { createAction, handleActions } from 'redux-actions';
import identity from 'lodash/identity';

import { tracePath } from '../../helpers/utils';
import * as consts from '../../helpers/consts';
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
  lessons: [],
  programs: [],
  lectures: [],
  publications: []
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

const onDashboardSuccess = (state, action) => {
  const {id, data} = action.payload;
  const latestUnitsArr = data.latest_units;
  //const promotedUnits = action.payload.promoted_units;

  if(Array.isArray(latestUnitsArr)){
      const publications = latestUnitsArr.filter(x => [consts.CT_PUBLICATION, 
                                                      consts.CT_ARTICLE].includes(x.content_type));

      const lessons = latestUnitsArr.filter(x => [consts.CT_LESSON_PART, 
                                                  consts.CT_FULL_LESSON, 
                                                  consts.CT_LELO_MIKUD,
                                                  consts.CT_KITEI_MAKOR].includes(x.content_type));
      
      const lectures = latestUnitsArr.filter(x => [consts.CT_LECTURE,
                                                  consts.CT_CHILDREN_LESSON,
                                                  consts.CT_VIRTUAL_LESSON,
                                                  consts.CT_WOMEN_LESSON].includes(x.content_type));

      const programs = latestUnitsArr.filter(x => [consts.CT_FRIENDS_GATHERING, 
                                                  consts.CT_MEAL, 
                                                  consts.CT_VIDEO_PROGRAM_CHAPTER,
                                                  consts.CT_EVENT_PART,
                                                  consts.CT_UNKNOWN,
                                                  consts.CT_TRAINING,
                                                  consts.CT_CLIP].includes(x.content_type));    
                                                  
      return{
        ...state,
        wip: false,
        lessons,
        programs,
        lectures,
        publications
      }
  }
  else{
    return {...state, wip: false};
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

const getLessons = state => state.lessons;
const getPrograms = state => state.programs;
const getLectures = state => state.lectures;
const getPublications = state => state.publications;

export const selectors = {
  getTags,
  getRoots,
  getTagById,
  getPath,
  getPathByID,
  getLessons,
  getLectures,
  getPrograms,
  getPublications
};

