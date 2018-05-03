import { createAction, handleActions } from 'redux-actions';

import { isEmpty, strCmp } from '../../helpers/utils';
import { selectors as mdb } from './mdb';
import { types as settings } from './settings';
import { selectors as sources } from './sources';
import { types as ssr } from './ssr';

/* Types */

const FETCH_ALL         = 'Series/FETCH_ALL';
const FETCH_ALL_SUCCESS = 'Series/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE = 'Series/FETCH_ALL_FAILURE';

export const types = {
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_ALL_FAILURE,
};

/* Actions */

const fetchAll        = createAction(FETCH_ALL);
const fetchAllSuccess = createAction(FETCH_ALL_SUCCESS);
const fetchAllFailure = createAction(FETCH_ALL_FAILURE);

export const actions = {
  fetchAll,
  fetchAllSuccess,
  fetchAllFailure,
};

/* Reducer */

const initialState = {
  allIDs: [],
  wip: {
    all: false,
  },
  errors: {
    all: null,
  },
};

/**
 * Set the wip and errors part of the state
 * @param state
 * @param action
 * @returns {{wip: {}, errors: {}}}
 */
const setStatus = (state, action) => {
  const wip    = { ...state.wip };
  const errors = { ...state.errors };

  switch (action.type) {
  case FETCH_ALL:
    wip.all = true;
    break;
  case FETCH_ALL_SUCCESS:
    wip.all    = false;
    errors.all = null;
    break;
  case FETCH_ALL_FAILURE:
    wip.all    = false;
    errors.all = action.payload;
    break;
  default:
    break;
  }

  return {
    ...state,
    wip,
    errors,
  };
};

const onFetchAllSuccess = (state, action) => ({
  ...state,
  allIDs: action.payload.collections.map(x => x.id),
});

const onSetLanguage = state => (
  {
    ...state,
    allIDs: [],
  }
);

const onSSRPrepare = state => ({
  ...state,
  errors: {
    all: state.errors.all ? state.errors.all.toString() : state.errors.all
  }
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_ALL]: setStatus,
  [FETCH_ALL_SUCCESS]: (state, action) => setStatus(onFetchAllSuccess(state, action), action),
  [FETCH_ALL_FAILURE]: setStatus,
}, initialState);

/* Selectors */

const getWip    = state => state.wip;
const getErrors = state => state.errors;

const $$sortTree = (node) => {
  if (isEmpty(node)) {
    return [];
  }

  // leaf nodes has array of items
  // we sort them by start_date
  if (Array.isArray(node.items)) {
    node.items.sort((a, b) => strCmp(a.start_date, b.start_date));
    return node;
  }

  // non-leaf nodes are reshaped to {name, items}
  // instead of {name, item, item, item...}
  const l = Object.keys(node)
    .filter(x => x !== 'name')
    .map(x => node[x]);
  l.sort(x => x.name);

  return {
    name: node.name,
    items: l.map($$sortTree),
  };
};

const getBySource = (state, mdbState, sourcesState) => {
  const srcPathById = sources.getPathByID(sourcesState);

  // sources might not have been loaded by now
  if (!srcPathById) {
    return [];
  }

  // construct the folder-like tree
  const tree = state.allIDs.reduce((acc, val) => {
    const series = mdb.getCollectionById(mdbState, val);

    // mdb might not have been loaded by now
    if (!series) {
      return acc;
    }

    const { source_id: sourceID } = series;
    if (!sourceID) {
      return acc;
    }

    const path = srcPathById(sourceID);
    if (!Array.isArray(path) || path.length === 0) {
      return acc;
    }

    // mkdir -p path[:]
    let dir = acc;
    for (let i = 0; i < path.length; i++) {
      dir[path[i].id] = dir[path[i].id] || {};
      dir             = dir[path[i].id];

      dir.name = path[i].name;
    }

    // mv series path.items
    dir.items = dir.items || [];
    dir.items.push(series);

    return acc;
  }, {});

  return $$sortTree(tree).items;
};

export const selectors = {
  getWip,
  getErrors,
  getBySource,
};
