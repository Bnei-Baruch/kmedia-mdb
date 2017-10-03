import { createAction, handleActions } from 'redux-actions';

/* Types */

const AUTOCOMPLETE         = 'Search/AUTOCOMPLETE';
const AUTOCOMPLETE_SUCCESS = 'Search/AUTOCOMPLETE_SUCCESS';
const AUTOCOMPLETE_FAILURE = 'Search/AUTOCOMPLETE_FAILURE';
const SEARCH               = 'Search/SEARCH';
const SEARCH_SUCCESS       = 'Search/SEARCH_SUCCESS';
const SEARCH_FAILURE       = 'Search/SEARCH_FAILURE';

export const types = {
  AUTOCOMPLETE,
  AUTOCOMPLETE_SUCCESS,
  AUTOCOMPLETE_FAILURE,
  SEARCH,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
};

/* Actions */

const autocomplete        = createAction(AUTOCOMPLETE);
const autocompleteSuccess = createAction(AUTOCOMPLETE_SUCCESS);
const autocompleteFailure = createAction(AUTOCOMPLETE_FAILURE);
const search              = createAction(SEARCH, (q, pageNo, pageSize) => ({ q, pageNo, pageSize }));
const searchSuccess       = createAction(SEARCH_SUCCESS);
const searchFailure       = createAction(SEARCH_FAILURE);

export const actions = {
  autocomplete,
  autocompleteSuccess,
  autocompleteFailure,
  search,
  searchSuccess,
  searchFailure,
};

/* Reducer */

const initialState = {};

export const reducer = handleActions({
  [AUTOCOMPLETE]: (state, action) => ({
    ...state,
    q: action.payload,
  }),
  [AUTOCOMPLETE_SUCCESS]: (state, action) => ({
    ...state,
    suggestions: action.payload,
  }),
  [AUTOCOMPLETE_FAILURE]: (state, action) => ({
    ...state,
    suggestions: null,
  }),
  [SEARCH]: (state, action) => ({
    ...state,
    ...action.payload,
    wip: true,
  }),
  [SEARCH_SUCCESS]: (state, action) => ({
    ...state,
    wip: false,
    error: null,
    results: action.payload,
  }),
  [SEARCH_FAILURE]: (state, action) => ({
    ...state,
    wip: false,
    error: action.payload,
  }),
}, initialState);

/* Selectors */

const getQuery       = state => state.q;
const getSuggestions = state => state.suggestions;
const getResults     = state => state.results;
const getWip     = state => state.wip;
const getError     = state => state.error;

export const selectors = {
  getQuery,
  getSuggestions,
  getResults,
  getWip,
  getError,
};

