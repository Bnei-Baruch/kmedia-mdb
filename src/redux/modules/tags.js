import { createAction, handleActions } from 'redux-actions';
import identity from 'lodash/identity';

import { tracePath } from '../../helpers/utils';
import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const RECEIVE_TAGS = 'Tags/RECEIVE_TAGS';

export const types = {
  RECEIVE_TAGS,
};

/* Actions */

const receiveTags = createAction(RECEIVE_TAGS);

export const actions = {
  receiveTags,
};

/* Reducer */

const initialState = {
  byId: {},
  roots: [],
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
      children: node.children ? node.children.map(x => x.id) : [],
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

  [RECEIVE_TAGS]: (state, action) => {
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

