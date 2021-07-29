import { createAction } from 'redux-actions';

import { handleActions } from './settings';

/* Types */
const FETCH_LIKES         = 'My/FETCH_LIKES';
const FETCH_LIKES_SUCCESS = 'My/FETCH_LIKES_SUCCESS';
const FETCH_LIKES_FAILURE = 'My/FETCH_LIKES_FAILURE';

const ADD_LIKE         = 'My/ADD_LIKE';
const ADD_LIKE_SUCCESS = 'My/ADD_LIKE_SUCCESS';
const ADD_LIKE_FAILURE = 'My/ADD_LIKE_FAILURE';

const FETCH_HISTORY         = 'My/FETCH_HISTORY';
const FETCH_HISTORY_SUCCESS = 'My/FETCH_HISTORY_SUCCESS';
const FETCH_HISTORY_FAILURE = 'My/FETCH_HISTORY_FAILURE';

export const types = {
  FETCH_LIKES,
  FETCH_LIKES_SUCCESS,
  FETCH_LIKES_FAILURE,

  ADD_LIKE,
  ADD_LIKE_SUCCESS,
  ADD_LIKE_FAILURE,

  FETCH_HISTORY,
  FETCH_HISTORY_SUCCESS,
  FETCH_HISTORY_FAILURE,
};

/* Actions */
const fetchLikes        = createAction(FETCH_LIKES);
const fetchLikesSuccess = createAction(FETCH_LIKES_SUCCESS);
const fetchLikesFailure = createAction(FETCH_LIKES_FAILURE);
const addLike           = createAction(FETCH_LIKES);

const addLikeSuccess = createAction(FETCH_LIKES_SUCCESS);
const addLikeFailure = createAction(FETCH_LIKES_FAILURE);

const fetchHistory        = createAction(FETCH_HISTORY);
const fetchHistorySuccess = createAction(FETCH_HISTORY_SUCCESS);
const fetchHistoryFailure = createAction(FETCH_HISTORY_FAILURE);

export const actions = {
  fetchLikes,
  fetchLikesSuccess,
  fetchLikesFailure,

  addLike,
  addLikeSuccess,
  addLikeFailure,

  fetchHistory,
  fetchHistorySuccess,
  fetchHistoryFailure,
};

/* Reducer */

const initialState = {
  likes: [],
  history: [],
  wip: {
    likes: false,
    history: false
  },
  errors: {
    likes: null,
    history: null,
  },
};

const onFetchLikesSuccess = (draft, payload) => {
  draft.likes        = payload.content_units;
  draft.wip.likes    = false;
  draft.errors.likes = false;
  return draft;
};

const onFetchHistorySuccess = (draft, payload) => {
  draft.history        = payload.history;
  draft.wip.history    = false;
  draft.errors.history = false;
  return draft;
};

export const reducer = handleActions({
  [FETCH_LIKES_SUCCESS]: onFetchLikesSuccess,
  [FETCH_HISTORY_SUCCESS]: onFetchHistorySuccess,
}, initialState);

/* Selectors */

const getLikes   = state => state.likes;
const getHistory = state => state.history;

export const selectors = {
  getLikes,
  getHistory,
};
