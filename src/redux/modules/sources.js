import { createAction, handleActions } from 'redux-actions';

/* Types */

const FETCH_SOURCES         = 'Sources/FETCH_SOURCES';
const FETCH_SOURCES_SUCCESS = 'Sources/FETCH_SOURCES_SUCCESS';
const FETCH_SOURCES_FAILURE = 'Sources/FETCH_SOURCES_FAILURE';

export const types = {
  FETCH_SOURCES,
  FETCH_SOURCES_SUCCESS,
  FETCH_SOURCES_FAILURE,
};

/* Actions */

const fetchSources        = createAction(FETCH_SOURCES);
const fetchSourcesSuccess = createAction(FETCH_SOURCES_SUCCESS);
const fetchSourcesFailure = createAction(FETCH_SOURCES_FAILURE);

export const actions = {
  fetchSources,
  fetchSourcesSuccess,
  fetchSourcesFailure,
};

/* Reducer */

const initialState = {
  sources: {},
  labels: {},
  error: null,
};

// Helper method to build sources from json response.
const buildSources = (json) => {
  if (!json) {
    return {};
  }

  const sources = json.reduce((acc, s) => {
    const codeOrId = s.code || s.uid;
    acc[codeOrId]  = { name: s.name, children: buildSources(s.children) };
    return acc;
  }, {});
  return sources;
};

const buildLabels = (json) => {
  if (!json) {
    return {};
  }

  const labels = json.reduce((acc, s) => {
    const codeOrId = s.code || s.uid;
    acc[codeOrId]  = s.name;
    Object.assign(acc, buildLabels(s.children));
    return acc;
  }, {});
  return labels;
};

const _fetchSourcesSuccess = (state, action) => {
  const sources = buildSources(action.payload);
  const labels  = buildLabels(action.payload);
  return {
    ...state,
    sources,
    labels,
  };
};

const _fetchSourcesFailure = (state, action) => {
  return {
    ...state,
    error: action.payload,
  };
};

export const reducer = handleActions({
  [FETCH_SOURCES_SUCCESS]: (state, action) => _fetchSourcesSuccess(state, action),
  [FETCH_SOURCES_FAILURE]: (state, action) => _fetchSourcesFailure(state, action),
}, initialState);

/* Selectors */

const getSources     = state => state.sources;
const getSourceLabel = state => codeOrId => state.labels[codeOrId];

export const selectors = {
  getSources,
  getSourceLabel,
};
