import { createAction } from 'redux-actions';
import { ALL_PAGE_NS } from '../../helpers/consts';

import { handleActions, types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */
const RECEIVE_COLLECTIONS = 'Page/RECEIVE_COLLECTIONS';
const FETCH_COLLECTIONS   = 'Page/FETCH_COLLECTIONS';

export const types = {
  RECEIVE_COLLECTIONS,
  FETCH_COLLECTIONS,
};

/* Actions */
const fetchCollections   = createAction(FETCH_COLLECTIONS, (namespace, p) => ({ namespace, ...p }));
const receiveCollections = createAction(RECEIVE_COLLECTIONS);

export const actions = {
  fetchCollections,
  receiveCollections,
};

/* Reducer */
const initialState = ALL_PAGE_NS.reduce((acc, ns) => ({
  ...acc, [ns]: {
    collectionsFetched: false, wip: false, error: null
  }
}), {});

const onSetLanguage = draft => {
  for (const ns in draft) {
    draft[ns].collectionsFetched = false;
  }
};

const onSSRPrepare = draft => {
  if (draft.err) {
    draft.err = draft.err.toString();
  }
};

const onReceiveCollections = (draft, namespace) => {
  draft[namespace] = { collectionsFetched: true, err: null, wip: false };
  return draft;
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_CONTENT_LANGUAGES]: onSetLanguage,

  [RECEIVE_COLLECTIONS]: onReceiveCollections,
}, initialState);

/* Selectors */

const wasFetchedByNS = (state, ns) => state[ns]?.collectionsFetched;

export const selectors = {
  wasFetchedByNS,
};
