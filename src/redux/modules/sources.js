import { createAction, handleActions } from 'redux-actions';
import identity from 'lodash/identity';

import { BS_IGROT, BS_SHAMATI, BS_TAAS, MR_TORA, RB_IGROT, RH_ZOHAR, } from '../../helpers/consts';
import { strCmp, tracePath } from '../../helpers/utils';
import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const RECEIVE_SOURCES = 'Sources/RECEIVE_SOURCES';
const SOURCES_SORT_BY = 'Sources/SOURCES_SORT_BY';

export const types = {
  RECEIVE_SOURCES,
  SOURCES_SORT_BY,
};

/* Actions */

const receiveSources = createAction(RECEIVE_SOURCES);
const sourcesSortBy  = createAction(SOURCES_SORT_BY);

export const actions = {
  receiveSources,
  sourcesSortBy,
};

/* Reducer */

const initialState = {
  byId: {},
  roots: [],
  sortedByAZ: {
    getByID: identity
  },
  sortedByBook: {
    getByID: identity
  },
  loaded: false,
  sortBy: 'AZ',
};

const NotToSort   = [BS_SHAMATI, BS_IGROT, BS_TAAS, RB_IGROT, MR_TORA, RH_ZOHAR];
const NotToFilter = [BS_TAAS];

const sortTree = (root) => {
  if (root.children) {
    root.children
      .sort((a, b) => strCmp(a.name, b.name))
      .forEach(sortTree);
  }
};

const sortSources = (items) => {
  items.forEach((i) => {
    // We not going to sort the upper level [i.e. 'kabbalists'],
    // especially if it doesn't have children
    if (!i.children) {
      return;
    }
    i.children.forEach((c) => {
      // The second level's id is the one that is used to distinguish
      // between sortable and not sortable sources
      const shouldSort = NotToSort.findIndex(a => a === c.id);
      if (shouldSort === -1) {
        sortTree(c);
      }
    });
  });
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

const prepareById = (payload) => {
  const book = JSON.parse(JSON.stringify(payload)); // Deep copy
  const byId = buildById(book);
  const az   = JSON.parse(JSON.stringify(payload)); // Deep copy
  // Yes, this is not good, but...
  // We sort sources according to Mizrachi's request
  // and this __changes__ data
  sortSources(az);
  const byIdAZ = buildById(az);

  return [byId, byIdAZ];
};

const getIdFuncs = (byId) => {
  const getByID     = id => byId[id];
  const getPath     = source => tracePath(source, getByID);
  const getPathByID = id => getPath(getByID(id));
  return { getByID, getPath, getPathByID };
};

const onSSRPrepare = () => ({ ...initialState });

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [settings.SET_LANGUAGE]: () => ({
    ...initialState,
  }),

  [RECEIVE_SOURCES]: (state, action) => {
    const [byId, byIdAZ] = prepareById(action.payload);

    // we keep selectors in state to avoid recreating them every time a selector is called
    const sortedByBook = getIdFuncs(byId);
    const sortedByAZ   = getIdFuncs(byIdAZ);

    return {
      ...state,
      byId,
      sortedByBook,
      sortedByAZ,
      loaded: true,
      roots: action.payload.map(x => x.id),
    };
  },

  [SOURCES_SORT_BY]: (state, action) => ({
    ...state,
    sortBy: action.payload,
  }),

}, initialState);

/* Selectors */

const $$getSourceBy = (state, idx) => {
  const f = state.sortBy === 'AZ' ? state.sortedByAZ : state.sortedByBook;
  return f[idx];
};

const areSourcesLoaded = state => state.loaded;
const getRoots         = state => state.roots;
const getSourceById    = state => $$getSourceBy(state, 'getByID');
const getPath          = state => $$getSourceBy(state, 'getPath');
const getPathByID      = state => $$getSourceBy(state, 'getPathByID');
const sortBy           = state => state.sortBy;

export const selectors = {
  areSourcesLoaded,
  getRoots,
  getSourceById,
  getPath,
  getPathByID,
  sortBy,
  NotToSort,
  NotToFilter,
};
