import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';

/* Types */

const FETCH_TAGS         = 'Tags/FETCH_TAGS';
const FETCH_TAGS_SUCCESS = 'Tags/FETCH_TAGS_SUCCESS';
const FETCH_TAGS_FAILURE = 'Tags/FETCH_TAGS_FAILURE';

export const types = {
  FETCH_TAGS,
  FETCH_TAGS_SUCCESS,
  FETCH_TAGS_FAILURE,
};

/* Actions */

const fetchTags        = createAction(FETCH_TAGS);
const fetchTagsSuccess = createAction(FETCH_TAGS_SUCCESS);
const fetchTagsFailure = createAction(FETCH_TAGS_FAILURE);

export const actions = {
  fetchTags,
  fetchTagsSuccess,
  fetchTagsFailure,
};

/* Reducer */

const initialState = {
  tags: {},
  error: null,
};

const buildTags = (json) => {
  if (!json) {
    return {};
  }

  const tags = json.reduce((acc, t) => {
    acc[t.uid]  = { ...t, children: buildTags(t.children) };
    return acc;
  }, {});
  return tags;
};

const _fetchTagsSuccess = (state, action) => {
  return {
    ...state,
    tags: buildTags(action.payload),
  };
};

const _fetchTagsFailure = (state, action) => {
  return {
    ...state,
    error: action.payload,
  };
};

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: () => initialState,
  [FETCH_TAGS_SUCCESS]: (state, action) => _fetchTagsSuccess(state, action),
  [FETCH_TAGS_FAILURE]: (state, action) => _fetchTagsFailure(state, action),
}, initialState);

/* Selectors */

const getTags       = state => state.tags;
const getTopics     = state => state.tags["mS7hrYXK"].children;
const getTopicLabel = state => uid => getTopics(state)[uid].label;

export const selectors = {
  getTags,
  getTopics,
  getTopicLabel,
};

