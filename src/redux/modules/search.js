import { createAction, handleActions } from 'redux-actions';

/* Types */

const AUTOCOMPLETE         = 'Search/AUTOCOMPLETE';
const AUTOCOMPLETE_SUCCESS = 'Search/AUTOCOMPLETE_SUCCESS';
const AUTOCOMPLETE_FAILURE = 'Search/AUTOCOMPLETE_FAILURE';

export const types = {
  AUTOCOMPLETE,
  AUTOCOMPLETE_SUCCESS,
  AUTOCOMPLETE_FAILURE,
};

/* Actions */

const autocomplete        = createAction(AUTOCOMPLETE);
const autocompleteSuccess = createAction(AUTOCOMPLETE_SUCCESS);
const autocompleteFailure = createAction(AUTOCOMPLETE_FAILURE);

export const actions = {
  autocomplete,
  autocompleteSuccess,
  autocompleteFailure,
};

/* Reducer */

const initialState = {};

export const reducer = handleActions({
  [AUTOCOMPLETE]: (state, action) => ({
    ...state,
    query: action.payload,
  }),

  [AUTOCOMPLETE_SUCCESS]: (state, action) => ({
    ...state,
    suggestions: action.payload,
  }),

  [AUTOCOMPLETE_FAILURE]: (state, action) => ({
    ...state,
    suggestions: null,
  }),
}, initialState);

/* Selectors */

const getQuery       = state => state.query;
const getSuggestions = state => state.suggestions;

export const selectors = {
  getQuery,
  getSuggestions,
};

