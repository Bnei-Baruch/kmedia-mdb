import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';

/* Types */
const RECEIVE_COLLECTIONS = 'Programs/RECEIVE_COLLECTIONS';

export const types = {
  RECEIVE_COLLECTIONS,
};

/* Actions */

const receiveCollections = createAction(RECEIVE_COLLECTIONS);

export const actions = {
  receiveCollections,
};

/* Reducer */

const initialState = {
  programs: [],
};

const onSetLanguage = state => ({
  ...state,
  programs: [],
});

const onReceiveCollections = (state, action) => ({
  ...state,
  programs: action.payload.map(x => x.id),
});

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: onSetLanguage,

  [RECEIVE_COLLECTIONS]: onReceiveCollections,
}, initialState);

/* Selectors */

const getPrograms = state => state.programs;

export const selectors = {
  getPrograms,
};
