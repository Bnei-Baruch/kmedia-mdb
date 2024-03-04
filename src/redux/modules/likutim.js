import { createAction } from 'redux-actions';
import { handleActions } from './settings';
import { types as ssr } from './ssr';
import { isEmpty } from '../../helpers/utils';

const FETCH_LIKUTIM_BY_TAGS         = 'FETCH_LIKUTIM_BY_TAGS';
const FETCH_LIKUTIM_BY_TAGS_SUCCESS = 'FETCH_LIKUTIM_BY_TAGS_SUCCESS';
const FETCH_LIKUTIM_BY_TAGS_FAILURE = 'FETCH_LIKUTIM_BY_TAGS_FAILURE';

export const types = {
  FETCH_LIKUTIM_BY_TAGS,
  FETCH_LIKUTIM_BY_TAGS_SUCCESS,
  FETCH_LIKUTIM_BY_TAGS_FAILURE,
};

// Actions
const fetchLikutimByTags        = createAction(FETCH_LIKUTIM_BY_TAGS);
const fetchLikutimByTagsSuccess = createAction(FETCH_LIKUTIM_BY_TAGS_SUCCESS);
const fetchLikutimByTagsFailure = createAction(FETCH_LIKUTIM_BY_TAGS_FAILURE);

export const actions = {
  fetchLikutimByTags,
  fetchLikutimByTagsSuccess,
  fetchLikutimByTagsFailure
};

/* Reducer */
const initialState = { wip: {}, err: {}, byKey: {} };

const onSSRPrepare   = state => {
  if (!isEmpty(state.err)) {
    state.err = JSON.stringify(state.err);
  }
};

const onByKey        = (state, key) => {
  state.err[key] = null;
  state.wip[key] = true;
};

const onByKeySuccess = (state, { content_units, key }) => {
  for (const cu of content_units) {
    cu.tags.forEach(id => {
      if (!key.includes(id)) return;
      const ids = state.byKey[key] ? state.byKey[key] : [];
      if (ids.includes(cu.id)) return;
      state.byKey[key] = [...ids, cu.id];
    });
  }

  console.log('likutim onByKeySuccess', key);
  state.wip[key] = false;
};

const onByKeyFailure = (state, { err, key }) => {
  state.err[key] = err;
  state.wip[key] = false;
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [FETCH_LIKUTIM_BY_TAGS]: onByKey,
  [FETCH_LIKUTIM_BY_TAGS_SUCCESS]: onByKeySuccess,
  [FETCH_LIKUTIM_BY_TAGS_FAILURE]: onByKeyFailure,
}, initialState);

const getWip   = (state, key) => state.wip[key];
const getError = (state, key) => state.err[key];
const getByTag = state => key => state.byKey[key];

export const selectors = {
  getWip,
  getError,
  getByTag,
};
