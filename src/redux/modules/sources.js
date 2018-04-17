import { createAction, handleActions } from 'redux-actions';
import identity from 'lodash/identity';
import mapValues from 'lodash/mapValues';

import { strCmp, tracePath } from '../../helpers/utils';
import { types as settings } from './settings';
import { types as ssr } from './ssr';
import { BS_IGROT, BS_SHAMATI, BS_TAAS, MR_TORA, RB_IGROT, RH_ZOHAR, } from '../../helpers/consts';

/* Types */

const FETCH_SOURCES         = 'Sources/FETCH_SOURCES';
const FETCH_SOURCES_SUCCESS = 'Sources/FETCH_SOURCES_SUCCESS';
const FETCH_SOURCES_FAILURE = 'Sources/FETCH_SOURCES_FAILURE';
const FETCH_INDEX           = 'Sources/FETCH_INDEX';
const FETCH_INDEX_SUCCESS   = 'Sources/FETCH_INDEX_SUCCESS';
const FETCH_INDEX_FAILURE   = 'Sources/FETCH_INDEX_FAILURE';
const FETCH_CONTENT         = 'Sources/FETCH_CONTENT';
const FETCH_CONTENT_SUCCESS = 'Sources/FETCH_CONTENT_SUCCESS';
const FETCH_CONTENT_FAILURE = 'Sources/FETCH_CONTENT_FAILURE';
const SOURCES_SORT_BY       = 'Sources/SOURCES_SORT_BY';

export const types = {
  FETCH_SOURCES,
  FETCH_SOURCES_SUCCESS,
  FETCH_SOURCES_FAILURE,
  FETCH_INDEX,
  FETCH_INDEX_SUCCESS,
  FETCH_INDEX_FAILURE,
  FETCH_CONTENT,
  FETCH_CONTENT_SUCCESS,
  FETCH_CONTENT_FAILURE,
  SOURCES_SORT_BY,
};

/* Actions */

const fetchSources        = createAction(FETCH_SOURCES);
const fetchSourcesSuccess = createAction(FETCH_SOURCES_SUCCESS);
const fetchSourcesFailure = createAction(FETCH_SOURCES_FAILURE);
const fetchIndex          = createAction(FETCH_INDEX);
const fetchIndexSuccess   = createAction(FETCH_INDEX_SUCCESS, (id, data) => ({ id, data }));
const fetchIndexFailure   = createAction(FETCH_INDEX_FAILURE, (id, err) => ({ id, err }));
const fetchContent        = createAction(FETCH_CONTENT, (id, name) => ({ id, name }));
const fetchContentSuccess = createAction(FETCH_CONTENT_SUCCESS);
const fetchContentFailure = createAction(FETCH_CONTENT_FAILURE);
const sourcesSortBy       = createAction(SOURCES_SORT_BY);

export const actions = {
  fetchSources,
  fetchSourcesSuccess,
  fetchSourcesFailure,
  fetchIndex,
  fetchIndexSuccess,
  fetchIndexFailure,
  fetchContent,
  fetchContentSuccess,
  fetchContentFailure,
  sourcesSortBy,
};

/* Reducer */

const initialState = {
  byId: {},
  roots: [],
  error: null,
  sortedByAZ: {
    getByID: identity
  },
  sortedByBook: {
    getByID: identity
  },
  indexById: {},
  sortBy: 'AZ',
  content: {
    data: null,
    wip: false,
    err: null,
  },
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

const onSSRPrepare = state => ({
  ...initialState,
  error: state.error ? state.error.toString() : state.error,
  indexById: mapValues(state.indexById, x => ({ ...x, err: x.err ? x.err.toString() : x.err })),
  content: {
    ...state.content,
    err: state.content.err ? state.content.err.toString() : state.content.err,
  },
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [settings.SET_LANGUAGE]: (state) => {
    const indexById = state.indexById || initialState.indexById;
    const content   = state.content || initialState.content;
    return {
      ...initialState,
      indexById,
      content,
    };
  },

  [FETCH_SOURCES_SUCCESS]: (state, action) => {
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
      error: null,
    };
  },

  [FETCH_SOURCES_FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
  }),

  [FETCH_INDEX]: (state, action) => ({
      ...state,
      indexById: {
        ...state.indexById,
        [action.payload]: { wip: true },
      }
  }),

  [FETCH_INDEX_SUCCESS]: (state, action) => {
    const { id, data } = action.payload;
    return {
      ...state,
      indexById: {
        ...state.indexById,
        [id]: { data, wip: false, err: null },
      }
    };
  },

  [FETCH_INDEX_FAILURE]: (state, action) => {
    const { id, err } = action.payload;
    return {
      ...state,
      indexById: {
        ...state.indexById,
        [id]: { err, wip: false },
      },
    };
  },

  [FETCH_CONTENT]: state => ({
    ...state,
    content: { wip: true }
  }),

  [FETCH_CONTENT_SUCCESS]: (state, action) => ({
    ...state,
    content: { data: action.payload, wip: false, err: null }
  }),

  [FETCH_CONTENT_FAILURE]: (state, action) => ({
    ...state,
    content: { wip: false, err: action.payload }
  }),

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
const getIndexById     = state => state.indexById;
const getContent       = state => state.content;
const sortBy           = state => state.sortBy;

export const selectors = {
  areSourcesLoaded,
  getRoots,
  getIndexById,
  getSourceById,
  getPath,
  getPathByID,
  getContent,
  sortBy,
  NotToSort,
  NotToFilter,
};
