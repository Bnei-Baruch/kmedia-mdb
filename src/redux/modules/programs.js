import { createAction, handleActions } from 'redux-actions';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';

import { types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */
const SET_TAB = 'Programs/SET_TAB';
const RECEIVE_COLLECTIONS = 'Programs/RECEIVE_COLLECTIONS';

export const types = {
  SET_TAB,
  RECEIVE_COLLECTIONS,
};

/* Actions */
const setTab = createAction(SET_TAB);
const receiveCollections = createAction(RECEIVE_COLLECTIONS);

export const actions = {
  setTab,
  receiveCollections,
};

/* Reducer */

const initialState = {
  programsByType: {},
  wip: false,
  error: null
};

const onSetLanguage = state => ({
  ...state,
  programsByType: {},
});

const onSSRPrepare = state => ({
  ...state,
  err: state.err ? state.err.toString() : state.err,
});

const onReceiveCollections = (state, action) => ({
  ...state,
  programsByType: mapValues(groupBy(action.payload, x => x.content_type), x => x.map(y => y.id)),
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: onSetLanguage,

  [RECEIVE_COLLECTIONS]: onReceiveCollections,
}, initialState);

/* Selectors */

const getProgramsByType = state => state.programsByType;

export const selectors = {
  getProgramsByType,
};
