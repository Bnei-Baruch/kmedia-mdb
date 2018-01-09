import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';

/* Types */

const FETCH_UNIT               = 'Publications/FETCH_UNIT';
const FETCH_UNIT_SUCCESS       = 'Publications/FETCH_UNIT_SUCCESS';
const FETCH_UNIT_FAILURE       = 'Publications/FETCH_UNIT_FAILURE';
const FETCH_COLLECTION         = 'Publications/FETCH_COLLECTION';
const FETCH_COLLECTION_SUCCESS = 'Publications/FETCH_COLLECTION_SUCCESS';
const FETCH_COLLECTION_FAILURE = 'Publications/FETCH_COLLECTION_FAILURE';

const FETCH_PUBLISHERS         = 'Publications/FETCH_PUBLISHERS';
const FETCH_PUBLISHERS_SUCCESS = 'Publications/FETCH_PUBLISHERS_SUCCESS';
const FETCH_PUBLISHERS_FAILURE = 'Publications/FETCH_PUBLISHERS_FAILURE';

export const types = {
  FETCH_UNIT,
  FETCH_UNIT_SUCCESS,
  FETCH_UNIT_FAILURE,
  FETCH_COLLECTION,
  FETCH_COLLECTION_SUCCESS,
  FETCH_COLLECTION_FAILURE,

  FETCH_PUBLISHERS,
  FETCH_PUBLISHERS_SUCCESS,
  FETCH_PUBLISHERS_FAILURE,
};

/* Actions */

const fetchUnit              = createAction(FETCH_UNIT);
const fetchUnitSuccess       = createAction(FETCH_UNIT_SUCCESS);
const fetchUnitFailure       = createAction(FETCH_UNIT_FAILURE, (id, err) => ({ id, err }));
const fetchCollection        = createAction(FETCH_COLLECTION);
const fetchCollectionSuccess = createAction(FETCH_COLLECTION_SUCCESS);
const fetchCollectionFailure = createAction(FETCH_COLLECTION_FAILURE, (id, err) => ({ id, err }));
const fetchPublishers        = createAction(FETCH_PUBLISHERS);
const fetchPublishersSuccess = createAction(FETCH_PUBLISHERS_SUCCESS);
const fetchPublishersFailure = createAction(FETCH_PUBLISHERS_FAILURE);

export const actions = {
  fetchUnit,
  fetchUnitSuccess,
  fetchUnitFailure,
  fetchCollection,
  fetchCollectionSuccess,
  fetchCollectionFailure,
  fetchPublishers,
  fetchPublishersSuccess,
  fetchPublishersFailure,
};

/* Reducer */

const initialState = {
  publisherById: {},
  wip: {
    units: {},
    collections: {},
    publishers: false,
  },
  errors: {
    units: {},
    collections: {},
    publishers: null,
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
  case FETCH_UNIT:
    wip.units = { ...wip.units, [action.payload]: true };
    break;
  case FETCH_COLLECTION:
    wip.collections = { ...wip.collections, [action.payload]: true };
    break;
  case FETCH_PUBLISHERS:
    wip.publishers = true;
    break;
  case FETCH_UNIT_SUCCESS:
    wip.units    = { ...wip.units, [action.payload]: false };
    errors.units = { ...errors.units, [action.payload]: null };
    break;
  case FETCH_COLLECTION_SUCCESS:
    wip.collections    = { ...wip.collections, [action.payload]: false };
    errors.collections = { ...errors.collections, [action.payload]: null };
    break;
  case FETCH_PUBLISHERS_SUCCESS:
    wip.publishers    = false;
    errors.publishers = null;
    break;
  case FETCH_UNIT_FAILURE:
    wip.units    = { ...wip.units, [action.payload.id]: false };
    errors.units = { ...errors.units, [action.payload.id]: action.payload.err };
    break;
  case FETCH_COLLECTION_FAILURE:
    wip.collections    = { ...wip.collections, [action.payload.id]: false };
    errors.collections = { ...errors.collections, [action.payload.id]: action.payload.err };
    break;
  case FETCH_PUBLISHERS_FAILURE:
    wip.publishers    = false;
    errors.publishers = action.payload;
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

const onFetchPublishersSuccess = (state, action) => {
  return {
    ...state,
    total: action.payload.total,
    publisherById: action.payload.publishers.reduce((acc, val) => {
      acc[val.id] = val;
      return acc;
    }, {}),
  };
};

const onSetLanguage = state => ({
  ...state,
  publisherById: {},
});

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_UNIT]: setStatus,
  [FETCH_UNIT_SUCCESS]: setStatus,
  [FETCH_UNIT_FAILURE]: setStatus,
  [FETCH_COLLECTION]: setStatus,
  [FETCH_COLLECTION_SUCCESS]: setStatus,
  [FETCH_COLLECTION_FAILURE]: setStatus,
  [FETCH_PUBLISHERS]: setStatus,
  [FETCH_PUBLISHERS_SUCCESS]: (state, action) =>
    setStatus(onFetchPublishersSuccess(state, action), action),
  [FETCH_PUBLISHERS_FAILURE]: setStatus,
}, initialState);

/* Selectors */

const getPublisherById = state => state.publisherById;
const getWip           = state => state.wip;
const getErrors        = state => state.errors;

export const selectors = {
  getPublisherById,
  getWip,
  getErrors,
};
