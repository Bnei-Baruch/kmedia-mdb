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
  tagIdsByPattern: {},
  error: null,
};

const buildTags = (json) => {
  if (!json) {
    return {};
  }

  const tags = json.reduce((acc, tag) => {
    acc[tag.uid] = { ...tag, children: tag.children ? tag.children.map(childTag => childTag.uid) : [] };
    if (tag.children) {
      return {
        ...acc,
        ...buildTags(tag.children)
      };
    }
    return acc;
  }, {});
  return tags;
};

const buildTagPatternToId = (tags = []) => {
  const patternToId = tags.reduce((acc, tag) => {
    acc[tag.pattern] = tag.uid;
    if (tag.children) {
      return {
        ...acc,
        ...buildTagPatternToId(tag.children)
      };
    }

    return acc;
  }, {});

  return patternToId;
};

const _fetchTagsSuccess = (state, action) => {
  const tags            = buildTags(action.payload);
  const tagIdsByPattern = buildTagPatternToId(action.payload);

  return {
    ...state,
    tags,
    tagIdsByPattern,
    error: null,
  };
};

const _fetchTagsFailure = (state, action) => ({
  ...state,
  error: action.payload,
});

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: () => initialState,
  [FETCH_TAGS_SUCCESS]: (state, action) => _fetchTagsSuccess(state, action),
  [FETCH_TAGS_FAILURE]: (state, action) => _fetchTagsFailure(state, action),
}, initialState);

/* Selectors */

const getTags                 = state => state.tags || {};
const getTagIdByPattern       = (state, pattern) => (state.tagIdsByPattern ? state.tagIdsByPattern[pattern] : null);
const getTagChildrenById      = (state, uid) => {
  const tags = getTags(state);
  if (tags[uid]) {
    return tags[uid].children.map(id => tags[id]);
  }

  return [];
};
const getTagChildrenByPattern = (state, pattern) => {
  const tagId = state.tagIdsByPattern[pattern];
  if (tagId) {
    return getTagChildrenById(state, tagId);
  }

  return [];
};

const getTagLabel = state => (uid) => {
  const tag = getTags(state)[uid];

  return tag ? tag.label : '';
};

export const selectors = {
  getTags,
  getTagLabel,
  getTagIdByPattern,
  getTagChildrenByPattern
};

