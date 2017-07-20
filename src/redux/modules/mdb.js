import { createAction, handleActions } from 'redux-actions';

import { types as system } from './system';
import { types as settings } from './settings';

/* Types */

const RECEIVE_COLLECTIONS   = 'MDB/RECEIVE_COLLECTIONS';
const RECEIVE_CONTENT_UNITS = 'MDB/RECEIVE_CONTENT_UNITS';

export const types = {
  RECEIVE_COLLECTIONS,
  RECEIVE_CONTENT_UNITS,
};

/* Actions */

const receiveCollections  = createAction(RECEIVE_COLLECTIONS);
const receiveContentUnits = createAction(RECEIVE_CONTENT_UNITS);

export const actions = {
  receiveCollections,
  receiveContentUnits,
};

/* Reducer */

const freshStore = () => ({
  cById: {},
  cuById: {},
});

const onReceiveCollections = (state, action) => {
  const items = action.payload || [];

  if (items.length === 0) {
    return state;
  }

  const cById  = { ...state.cById };
  const cuById = { ...state.cuById };
  items.forEach((x) => {
    const y = {...x};
    if (y.content_units) {
      y.ccuNames = y.ccuNames || {};
      y.cuIDs    = y.content_units.map((cu) => {
        y.ccuNames[cu.id] = cu.name_in_collection;
        const updatedCU   = Object.assign({}, cu, state.cuById[cu.id]);
        delete updatedCU.name_in_collection;
        cuById[cu.id] = updatedCU;
        return cu.id;
      });
      delete y.content_units;
    }

    cById[y.id] = Object.assign({}, state.cById[y.id], y);
  });
  return {
    ...state,
    cById,
    cuById,
  };
};

const onReceiveContentUnits = (state, action) => {
  const items = action.payload || [];

  if (items.length === 0) {
    return state;
  }

  const cById  = { ...state.cById };
  const cuById = { ...state.cuById };
  items.forEach((x) => {
    cuById[x.id] = Object.assign({}, state.cuById[x.id], x);
    if (x.collections) {
      Object.values(x.collections).forEach((c) => {
        cById[c.id] = Object.assign({}, c, state.cById[c.id]);
      });
    }
  });
  return {
    ...state,
    cById,
    cuById,
  };
};

export const reducer = handleActions({
  [system.INIT]: () => freshStore(),
  [settings.SET_LANGUAGE]: () => freshStore(),
  [RECEIVE_COLLECTIONS]: (state, action) => onReceiveCollections(state, action),
  [RECEIVE_CONTENT_UNITS]: (state, action) => onReceiveContentUnits(state, action),
}, freshStore());

/* Selectors */

const getCollectionById   = state => id => state.cById[id];
const getUnitById         = state => id => state.cuById[id];
const getDenormCollection = (state, id) => {
  const c = state.cById[id];
  if (c && Array.isArray(c.cuIDs)) {
    c.content_units = c.cuIDs.map(x => state.cuById[x]).filter(x => !!x);
  }
  return c;
};

export const selectors = {
  getCollectionById,
  getUnitById,
  getDenormCollection,
};
