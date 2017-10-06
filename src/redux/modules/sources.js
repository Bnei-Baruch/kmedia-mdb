import { createAction, handleActions } from 'redux-actions';
import identity from 'lodash/identity';
import { tracePath } from '../../helpers/utils';
import { types as settings } from './settings';

/* Types */

const FETCH_SOURCES         = 'Sources/FETCH_SOURCES';
const FETCH_SOURCES_SUCCESS = 'Sources/FETCH_SOURCES_SUCCESS';
const FETCH_SOURCES_FAILURE = 'Sources/FETCH_SOURCES_FAILURE';

export const types = {
  FETCH_SOURCES,
  FETCH_SOURCES_SUCCESS,
  FETCH_SOURCES_FAILURE,
};

/* Actions */

const fetchSources        = createAction(FETCH_SOURCES);
const fetchSourcesSuccess = createAction(FETCH_SOURCES_SUCCESS);
const fetchSourcesFailure = createAction(FETCH_SOURCES_FAILURE);

export const actions = {
  fetchSources,
  fetchSourcesSuccess,
  fetchSourcesFailure,
};

/* Reducer */

const initialState = {
  byId: {},
  roots: [],
  error: null,
  getByID: identity
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

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: () => initialState,

  [FETCH_SOURCES_SUCCESS]: (state, action) => {
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
      error: null,
    };
  },

  [FETCH_SOURCES_FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
  }),
}, initialState);

/* Selectors */

const getSources    = state => state.byId;
const getRoots      = state => state.roots;
const getSourceById = state => state.getByID;
const getPath       = state => state.getPath;
const getPathByID   = state => state.getPathByID;

export const selectors = {
  getSources,
  getRoots,
  getSourceById,
  getPath,
  getPathByID,
};
