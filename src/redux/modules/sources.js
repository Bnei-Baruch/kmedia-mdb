import { createAction, handleActions } from 'redux-actions';

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
    byId[node.uid || node.code] = {
      ...node,
      children: node.children ? node.children.map(x => x.uid) : node,
    };
  }

  return byId;
};

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: () => initialState,

  [FETCH_SOURCES_SUCCESS]: (state, action) => ({
    ...state,
    byId: buildById(action.payload),
    roots: action.payload.map(x => x.code),
    error: null,
  }),

  [FETCH_SOURCES_FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
  }),
}, initialState);

/* Selectors */

const getSources    = state => state.byId;
const getRoots      = state => state.roots;
const getSourceById = state => codeOrId => state.byId[codeOrId];

export const selectors = {
  getSources,
  getRoots,
  getSourceById,
};
