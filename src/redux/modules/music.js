import { createAction } from 'redux-actions';
import { handleActions, types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */

const FETCH_MUSIC         = 'FETCH_MUSIC';
const FETCH_MUSIC_SUCCESS = 'FETCH_MUSIC_SUCCESS';
const FETCH_MUSIC_FAILURE = 'FETCH_MUSIC_FAILURE';

export const types = {
  FETCH_MUSIC,
  FETCH_MUSIC_SUCCESS,
  FETCH_MUSIC_FAILURE,
};

/* Actions */

const fetchMusic        = createAction(FETCH_MUSIC);
const fetchMusicSuccess = createAction(FETCH_MUSIC_SUCCESS);
const fetchMusicFailure = createAction(FETCH_MUSIC_FAILURE);

export const actions = {
  fetchMusic,
  fetchMusicSuccess,
  fetchMusicFailure,
};

/* Reducer */

const initialState = {
  wip: false,
  err: null,
  musicData: [],
};

const onSetLanguage = draft => {
  draft.musicData = [];
};

const onSuccess = (draft, payload) => {
  draft.wip       = false;
  draft.err       = null;
  draft.musicData = payload || [];
};

const onFailure = (draft, payload) => {
  draft.wip = false;
  draft.err = payload;
};

const onSSRPrepare = draft => {
  if (draft.err) {
    draft.err = draft.err.toString();
  }
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_CONTENT_LANGUAGES]: onSetLanguage,

  [FETCH_MUSIC]: draft => {
    draft.wip = true;
  },
  [FETCH_MUSIC_SUCCESS]: onSuccess,
  [FETCH_MUSIC_FAILURE]: onFailure,
}, initialState);

/* Selectors */

const getWip       = state => state.wip;
const getError     = state => state.err;
const getMusicData = state => state.musicData;

export const selectors = {
  getWip,
  getError,
  getMusicData,
};
