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
    // make a copy of incoming data since we're about to mutate it
    const y = { ...x };

    // normalize content units
    if (y.content_units) {
      y.ccuNames = y.ccuNames || {};
      y.cuIDs    = y.content_units.map((cu) => {
        const ccuName     = cu.name_in_collection;
        y.ccuNames[cu.id] = ccuName;

        // make a copy of content unit and set this collection ccuName
        const updatedCU = { ...cu, ...state.cuById[cu.id] };
        updatedCU.cIDs  = { ...updatedCU.cIDs, [ccuName]: y.id };

        // we delete it's name_in_collection
        // as it might be overridden by successive calls from different collections
        delete updatedCU.name_in_collection;

        cuById[cu.id] = updatedCU;

        return cu.id;
      });
      delete y.content_units;
    }

    // update collection in store
    cById[y.id] = { ...state.cById[y.id], ...y };
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
    // make a copy of incoming data since we're about to mutate it
    const y = { ...x };

    // normalize collections
    if (y.collections) {
      y.cIDs = Object.entries(y.collections).reduce((acc, val) => {
        const [k, v]         = val;
        const [cID, ccuName] = k.split('____');

        // make a copy of collection and set this unit ccuName
        const updatedC    = { ...v, ...state.cById[v.id] };
        updatedC.ccuNames = { ...updatedC.ccuNames, [y.id]: ccuName };
        cById[v.id]       = updatedC;

        acc[ccuName] = cID;
        return acc;
      }, {});
      delete y.collections;
    }

    // normalize derived content units
    if (y.derived_units) {
      y.dduIDs = Object.entries(y.derived_units).reduce((acc, val) => {
        const [k, v]          = val;
        const [cuID, relName] = k.split('____');

        // make a copy of derived unit and set this unit as source name
        const updatedDU  = { ...v, ...state.cuById[v.id] };
        updatedDU.sduIDs = { ...updatedDU.sduIDs, [relName]: y.id };
        cuById[v.id]     = updatedDU;

        acc[relName] = cuID;
        return acc;
      }, {});
      delete y.derived_units;
    }

    // normalize source content units
    if (y.source_units) {
      y.sduIDs = Object.entries(y.source_units).reduce((acc, val) => {
        const [k, v]          = val;
        const [cuID, relName] = k.split('____');

        // make a copy of source unit and set this unit as derived name
        const updatedDU  = { ...v, ...state.cuById[v.id] };
        updatedDU.dduIDs = { ...updatedDU.dduIDs, [relName]: y.id };
        cuById[v.id]     = updatedDU;

        acc[relName] = cuID;
        return acc;
      }, {});
      delete y.source_units;
    }

    cuById[y.id] = { ...state.cuById[y.id], ...y };
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

const getCollectionById = (state, id) => state.cById[id];
const getUnitById       = (state, id) => state.cuById[id];

const getDenormCollection = (state, id) => {
  const c = state.cById[id];
  if (c && Array.isArray(c.cuIDs)) {
    c.content_units = c.cuIDs.map(x => state.cuById[x]).filter(x => !!x);
  }
  return c;
};

const denormalizeObject = (byID, obj) => (
  Object.entries(obj || {}).reduce((acc, val) => {
    const [k, v] = val;
    const c      = byID[v];
    if (c) {
      acc[k] = c;
    }
    return acc;
  }, {})
);

const getDenormContentUnit = (state, id) => {
  const cu = state.cuById[id];

  if (cu) {
    // denormalize collections
    cu.collections = denormalizeObject(state.cById, cu.cIDs);

    // denormalize derived units
    cu.derived_units = denormalizeObject(state.cuById, cu.dduIDs);

    // denormalize source units
    cu.source_units = denormalizeObject(state.cuById, cu.sduIDs);
  }

  return cu;
};

export const selectors = {
  getCollectionById,
  getUnitById,
  getDenormCollection,
  getDenormContentUnit,
};
