import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';

/* Types */
const RECEIVE_COLLECTIONS      = 'Programs/RECEIVE_COLLECTIONS';
const RECEIVE_RECENTLY_UPDATED = 'Programs/RECEIVE_RECENTLY_UPDATED';

export const types = {
  RECEIVE_COLLECTIONS,
  RECEIVE_RECENTLY_UPDATED,
};

/* Actions */

const receiveCollections     = createAction(RECEIVE_COLLECTIONS);
const receiveRecentlyUpdated = createAction(RECEIVE_RECENTLY_UPDATED);

export const actions = {
  receiveCollections,
  receiveRecentlyUpdated,
};

/* Reducer */

const initialState = {
  genres: [],
  programs: [],
  recentlyUpdated: [],
};

const onSetLanguage = state => (
  {
    ...state,
    genres: [],
    programs: [],
  }
);

const onReceiveCollections = (state, action) => {
  const genres = [...new Set(action.payload.map(x => x.genres).reduce(
    (acc, cur) => acc.concat(cur),
    []
  ))].sort();

  return {
    ...state,
    genres,
    programs: action.payload,
  };
};

const onReceiveRecentlyUpdated = (state, action) => {
  return {
    ...state,
    recentlyUpdated: action.payload
  };
};

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: onSetLanguage,

  [RECEIVE_COLLECTIONS]: onReceiveCollections,
  [RECEIVE_RECENTLY_UPDATED]: onReceiveRecentlyUpdated,
}, initialState);

/* Selectors */

const getGenres          = state => state.genres;
const getPrograms        = state => state.programs;
const getRecentlyUpdated = state => state.recentlyUpdated;

export const selectors = {
  getGenres,
  getPrograms,
  getRecentlyUpdated,
};
