import { createAction, handleActions } from 'redux-actions';

import { types as system } from './system';
import { types as settings } from './settings';

/* Types */

const FETCH_UNIT               = 'MDB/FETCH_UNIT';
const FETCH_UNIT_SUCCESS       = 'MDB/FETCH_UNIT_SUCCESS';
const FETCH_UNIT_FAILURE       = 'MDB/FETCH_UNIT_FAILURE';
const FETCH_COLLECTION         = 'MDB/FETCH_COLLECTION';
const FETCH_COLLECTION_SUCCESS = 'MDB/FETCH_COLLECTION_SUCCESS';
const FETCH_COLLECTION_FAILURE = 'MDB/FETCH_COLLECTION_FAILURE';

const RECEIVE_COLLECTIONS   = 'MDB/RECEIVE_COLLECTIONS';
const RECEIVE_CONTENT_UNITS = 'MDB/RECEIVE_CONTENT_UNITS';

export const types = {
  FETCH_UNIT,
  FETCH_UNIT_SUCCESS,
  FETCH_UNIT_FAILURE,
  FETCH_COLLECTION,
  FETCH_COLLECTION_SUCCESS,
  FETCH_COLLECTION_FAILURE,

  RECEIVE_COLLECTIONS,
  RECEIVE_CONTENT_UNITS,
};

/* Actions */

const fetchUnit              = createAction(FETCH_UNIT);
const fetchUnitSuccess       = createAction(FETCH_UNIT_SUCCESS, (id, data) => ({ id, data }));
const fetchUnitFailure       = createAction(FETCH_UNIT_FAILURE, (id, err) => ({ id, err }));
const fetchCollection        = createAction(FETCH_COLLECTION);
const fetchCollectionSuccess = createAction(FETCH_COLLECTION_SUCCESS, (id, data) => ({ id, data }));
const fetchCollectionFailure = createAction(FETCH_COLLECTION_FAILURE, (id, err) => ({ id, err }));
const receiveCollections     = createAction(RECEIVE_COLLECTIONS);
const receiveContentUnits    = createAction(RECEIVE_CONTENT_UNITS);

export const actions = {
  fetchUnit,
  fetchUnitSuccess,
  fetchUnitFailure,
  fetchCollection,
  fetchCollectionSuccess,
  fetchCollectionFailure,
  receiveCollections,
  receiveContentUnits,
};

/* Reducer */

const freshStore = () => ({
  cById: {},
  cuById: {},
  wip: {
    units: {},
    collections: {},
  },
  errors: {
    units: {},
    collections: {},
  },
});

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
  case FETCH_UNIT:
    wip.units = { ...wip.units, [action.payload]: true };
    break;
  case FETCH_COLLECTION:
    wip.collections = { ...wip.collections, [action.payload]: true };
    break;
  case FETCH_UNIT_SUCCESS:
    wip.units    = { ...wip.units, [action.payload.id]: false };
    errors.units = { ...errors.units, [action.payload.id]: null };
    break;
  case FETCH_COLLECTION_SUCCESS:
    wip.collections    = { ...wip.collections, [action.payload.id]: false };
    errors.collections = { ...errors.collections, [action.payload.id]: null };
    break;
  case FETCH_UNIT_FAILURE:
    wip.units    = { ...wip.units, [action.payload.id]: false };
    errors.units = { ...errors.units, [action.payload.id]: action.payload.err };
    break;
  case FETCH_COLLECTION_FAILURE:
    wip.collections    = { ...wip.collections, [action.payload.id]: false };
    errors.collections = { ...errors.collections, [action.payload.id]: action.payload.err };
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
        updatedCU.cIDs  = { ...updatedCU.cIDs, [`${y.id}____${ccuName || ''}`]: y.id };

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
        const updatedC = { ...v, ...state.cById[v.id] };
        if (updatedC.cuIDs) {
          if (updatedC.cuIDs.findIndex(z => z === y.id) === -1) {
            updatedC.cuIDs = [...updatedC.cuIDs, y.id];
          }
        } else {
          updatedC.cuIDs = [y.id];
        }
        updatedC.ccuNames = { ...updatedC.ccuNames, [y.id]: ccuName };
        cById[v.id]       = updatedC;

        acc[k] = cID;
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
        updatedDU.sduIDs = { ...updatedDU.sduIDs, [y.id]: relName };
        cuById[v.id]     = updatedDU;

        acc[k] = cuID;
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
        updatedDU.dduIDs = { ...updatedDU.dduIDs, [y.id]: relName };
        cuById[v.id]     = updatedDU;

        acc[k] = cuID;
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

  [FETCH_UNIT]: setStatus,
  [FETCH_UNIT_SUCCESS]: (state, action) =>
    setStatus(onReceiveContentUnits(state, { payload: [action.payload.data] }), action),
  [FETCH_UNIT_FAILURE]: setStatus,
  [FETCH_COLLECTION]: setStatus,
  [FETCH_COLLECTION_SUCCESS]: (state, action) =>
    setStatus(onReceiveCollections(state, { payload: [action.payload.data] }), action),
  [FETCH_COLLECTION_FAILURE]: setStatus,

  [RECEIVE_COLLECTIONS]: (state, action) => onReceiveCollections(state, action),
  [RECEIVE_CONTENT_UNITS]: (state, action) => onReceiveContentUnits(state, action),
}, freshStore());

/* Selectors */

const getCollectionById = (state, id) => state.cById[id];
const getUnitById       = (state, id) => state.cuById[id];
const getWip            = state => state.wip;
const getErrors         = state => state.errors;

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

const getDenormCollectionWUnits = (state, id) => {
  const c = state.cById[id];
  if (c && Array.isArray(c.cuIDs)) {
    c.content_units = c.cuIDs.map(x => getDenormContentUnit(state, x)).filter(x => !!x);
  }
  return c;
};

export const selectors = {
  getCollectionById,
  getUnitById,
  getWip,
  getErrors,
  getDenormCollection,
  getDenormCollectionWUnits,
  getDenormContentUnit
};
