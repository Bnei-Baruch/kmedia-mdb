import { createAction, handleActions } from 'redux-actions';
import identity from 'lodash/identity';
import { tracePath } from '../../helpers/utils';
import { types as settings } from './settings';

/* Types */

const FETCH_SOURCES         = 'Sources/FETCH_SOURCES';
const FETCH_SOURCES_SUCCESS = 'Sources/FETCH_SOURCES_SUCCESS';
const FETCH_SOURCES_FAILURE = 'Sources/FETCH_SOURCES_FAILURE';
const FETCH_CONTENT         = 'Sources/FETCH_CONTENT';
const FETCH_CONTENT_SUCCESS = 'Sources/FETCH_CONTENT_SUCCESS';
const FETCH_CONTENT_FAILURE = 'Sources/FETCH_CONTENT_FAILURE';

export const types = {
  FETCH_SOURCES,
  FETCH_SOURCES_SUCCESS,
  FETCH_SOURCES_FAILURE,
  FETCH_CONTENT,
  FETCH_CONTENT_SUCCESS,
  FETCH_CONTENT_FAILURE,
};

/* Actions */

const fetchSources        = createAction(FETCH_SOURCES);
const fetchSourcesSuccess = createAction(FETCH_SOURCES_SUCCESS);
const fetchSourcesFailure = createAction(FETCH_SOURCES_FAILURE);
const fetchContent        = createAction(FETCH_CONTENT);
const fetchContentSuccess = createAction(FETCH_CONTENT_SUCCESS);
const fetchContentFailure = createAction(FETCH_CONTENT_FAILURE);

export const actions = {
  fetchSources,
  fetchSourcesSuccess,
  fetchSourcesFailure,
  fetchContent,
  fetchContentSuccess,
  fetchContentFailure,
};

/* Reducer */

const initialState = {
  byId: {},
  roots: [],
  error: null,
  getByID: identity,

  byIdContent: {},
  error_content: null,
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
      content: null,
      error: null
    };
  }

  return byId;
};

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: (state) => {
    const content = state.byIdContent || initialState.byIdContent;
    return {
      ...initialState,
      content
    };
  },

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

  [FETCH_CONTENT_SUCCESS]: (state, action) => {
    const { id, index } = action.payload;
    const content       = {
      ...state.byIdContent,
      [id]: index,
    };
    return {
      ...state,
      byIdContent: content
    };
  },

  [FETCH_SOURCES_FAILURE]: (state, action) => ({
    ...state,
    error_content: action.payload,
  })
}, initialState);

/* Selectors */

const getSources     = state => state.byId;
const getRoots       = state => state.roots;
const getSourceById  = state => state.getByID;
const getPath        = state => state.getPath;
const getPathByID    = state => state.getPathByID;
const getContentByID = state => state.byIdContent;

export const selectors = {
  getSources,
  getRoots,
  getSourceById,
  getPath,
  getPathByID,
  getContentByID,
};
