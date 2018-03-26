import { createAction, handleActions } from 'redux-actions';
import identity from 'lodash/identity';

import { tracePath } from '../../helpers/utils';
import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const FETCH_TAGS         = 'Tags/FETCH_TAGS';
const FETCH_TAGS_SUCCESS = 'Tags/FETCH_TAGS_SUCCESS';
const FETCH_TAGS_FAILURE = 'Tags/FETCH_TAGS_FAILURE';

export const types = {
  FETCH_TAGS,
  FETCH_TAGS_SUCCESS,
  FETCH_TAGS_FAILURE,
};

/* Actions */

const fetchTags        = createAction(FETCH_TAGS);
const fetchTagsSuccess = createAction(FETCH_TAGS_SUCCESS);
const fetchTagsFailure = createAction(FETCH_TAGS_FAILURE);

export const actions = {
  fetchTags,
  fetchTagsSuccess,
  fetchTagsFailure,
};

/* Reducer */

const initialState = {
  byId: {},
  roots: [],
  tagIdsByPattern: {},
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

const onSSRPrepare = state => ({
  ...initialState,
  error: state.error ? state.error.toString() : state.error,
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [settings.SET_LANGUAGE]: () => initialState,

  [FETCH_TAGS_SUCCESS]: (state, action) => {
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

  [FETCH_TAGS_FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
  }),
}, initialState);

/* Selectors */

const getTags     = state => state.byId;
const getRoots    = state => state.roots;
const getTagById  = state => state.getByID;
const getPath     = state => state.getPath;
const getPathByID = state => state.getPathByID;

export const selectors = {
  getTags,
  getRoots,
  getTagById,
  getPath,
  getPathByID,
};

