import { createAction } from 'redux-actions';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';

import { handleActions, types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */
const RECEIVE_COLLECTIONS = 'Programs/RECEIVE_COLLECTIONS';
const FETCH_COLLECTIONS   = 'Programs/FETCH_COLLECTIONS';

export const types = {
  RECEIVE_COLLECTIONS,
  FETCH_COLLECTIONS,
};

/* Actions */
const fetchCollections   = createAction(FETCH_COLLECTIONS);
const receiveCollections = createAction(RECEIVE_COLLECTIONS);

export const actions = {
  fetchCollections,
  receiveCollections,
};

/* Reducer */

const initialState = {
  programsByType: {},
  wip: false,
  error: null
};

const onSetLanguage = draft => {
  draft.programsByType = {};
  draft.wip            = false;
  draft.error          = null;
};

const onSSRPrepare = draft => {
  if (draft.err) {
    draft.err = draft.err.toString();
  }
};

const onReceiveCollections = (draft, payload) => {
  draft.programsByType = mapValues(groupBy(payload, x => x.content_type), x => x.map(y => y.id));
};

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
