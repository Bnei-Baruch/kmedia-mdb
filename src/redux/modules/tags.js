import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';

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
  tags: {},
  tagIdsByPattern: {},
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
    byId[node.id] = {
      ...node,
      children: node.children ? node.children.map(x => x.id) : node,
    };
  }

  return byId;
};

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: () => initialState,

  [FETCH_TAGS_SUCCESS]: (state, action) => ({
    ...state,
    byId: buildById(action.payload),
    roots: action.payload.map(x => x.id),
    error: null,
  }),

  [FETCH_TAGS_FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
  }),
}, initialState);

/* Selectors */

const getTags    = state => state.byId;
const getRoots   = state => state.roots;
const getTagById = state => id => state.byId[id];

export const selectors = {
  getTags,
  getRoots,
  getTagById,
};

