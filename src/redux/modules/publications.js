import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';

/* Types */

const FETCH_PUBLISHERS         = 'Publications/FETCH_PUBLISHERS';
const FETCH_PUBLISHERS_SUCCESS = 'Publications/FETCH_PUBLISHERS_SUCCESS';
const FETCH_PUBLISHERS_FAILURE = 'Publications/FETCH_PUBLISHERS_FAILURE';

export const types = {
  FETCH_PUBLISHERS,
  FETCH_PUBLISHERS_SUCCESS,
  FETCH_PUBLISHERS_FAILURE,
};

/* Actions */

const fetchPublishers        = createAction(FETCH_PUBLISHERS);
const fetchPublishersSuccess = createAction(FETCH_PUBLISHERS_SUCCESS);
const fetchPublishersFailure = createAction(FETCH_PUBLISHERS_FAILURE);

export const actions = {
  fetchPublishers,
  fetchPublishersSuccess,
  fetchPublishersFailure,
};

/* Reducer */

const initialState = {
  publisherById: {},
  wip: {
    publishers: false,
  },
  errors: {
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
  case FETCH_PUBLISHERS:
    wip.publishers = true;
    break;
  case FETCH_PUBLISHERS_SUCCESS:
    wip.publishers    = false;
    errors.publishers = null;
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

const onFetchPublishersSuccess = (state, action) => ({
  ...state,
  total: action.payload.total,
  publisherById: action.payload.publishers.reduce((acc, val) => {
    acc[val.id] = val;
    return acc;
  }, {}),
});

const onSetLanguage = state => ({
  ...state,
  publisherById: {},
});

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: onSetLanguage,

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
