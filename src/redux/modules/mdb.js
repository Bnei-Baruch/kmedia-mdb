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

const _freshStore = () => ({
  cById: {},
  cuById: {},
});

const _receiveCollections = (state, action) => {
  const items = action.payload || [];

  if (items.length === 0) {
    return state;
  }

  const cById  = { ...state.cById };
  const cuById = { ...state.cuById };
  items.forEach((x) => {
    cById[x.id] = Object.assign({}, state.cById[x.id], x);
    if (x.content_units) {
      x.content_units.forEach((cu) => {
        cuById[cu.id] = Object.assign({}, cu, state.cuById[cu.id]);
      });
    }
  });
  return {
    ...state,
    cById,
    cuById,
  };
};

const _receiveContentUnits = (state, action) => {
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
  [system.INIT]: () => _freshStore(),
  [settings.SET_LANGUAGE]: () => _freshStore(),
  [RECEIVE_COLLECTIONS]: (state, action) => _receiveCollections(state, action),
  [RECEIVE_CONTENT_UNITS]: (state, action) => _receiveContentUnits(state, action),
}, _freshStore());

/* Selectors */

const getCollectionById = state => id => state.cById[id];
const getUnitById       = state => id => state.cuById[id];

export const selectors = {
  getCollectionById,
  getUnitById,
};
