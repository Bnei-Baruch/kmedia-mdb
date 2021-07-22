import { createAction } from 'redux-actions';

import { handleActions } from './settings';

/* Types */
const FETCH_LIKES               = 'My/FETCH_FETCH_LIKES';
const FETCH_FETCH_LIKES_SUCCESS = 'My/FETCH_FETCH_LIKES_SUCCESS';
const FETCH_FETCH_LIKES_FAILURE = 'My/FETCH_FETCH_LIKES_FAILURE';

const ADD_LIKE         = 'My/ADD_LIKE';
const ADD_LIKE_SUCCESS = 'My/ADD_LIKE_SUCCESS';
const ADD_LIKE_FAILURE = 'My/ADD_LIKE_FAILURE';

export const types = {
  FETCH_LIKES,
  FETCH_FETCH_LIKES_SUCCESS,
  FETCH_FETCH_LIKES_FAILURE,

  ADD_LIKE,
  ADD_LIKE_SUCCESS,
  ADD_LIKE_FAILURE,
};

/* Actions */
const fetchLikes        = createAction(FETCH_LIKES);
const fetchLikesSuccess = createAction(FETCH_FETCH_LIKES_SUCCESS);
const fetchLikesFailure = createAction(FETCH_FETCH_LIKES_FAILURE);

const addLike        = createAction(FETCH_LIKES);
const addLikeSuccess = createAction(FETCH_FETCH_LIKES_SUCCESS);
const addLikeFailure = createAction(FETCH_FETCH_LIKES_FAILURE);

export const actions = {
  fetchLikes,
  fetchLikesSuccess,
  fetchLikesFailure,

  addLike,
  addLikeSuccess,
  addLikeFailure,
};

/* Reducer */

const initialState = {
  likes: [],
  wip: {
    likes: false,
  },
  errors: {
    likes: null,
  },
};

const onFetchLikesSuccess = (draft, payload) => {
  draft.likes        = payload.content_units;
  draft.wip.likes    = false;
  draft.errors.likes = false;
  return draft;
};

export const reducer = handleActions({
  [FETCH_FETCH_LIKES_SUCCESS]: onFetchLikesSuccess,
}, initialState);

/* Selectors */

const getLikes = state => state.likes;

export const selectors = {
  getLikes,
};
