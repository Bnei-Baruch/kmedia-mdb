import { createAction, handleActions } from 'redux-actions';

import { types as ssr } from './ssr';

/* Types */

const AUTOCOMPLETE         = 'Search/AUTOCOMPLETE';
const AUTOCOMPLETE_SUCCESS = 'Search/AUTOCOMPLETE_SUCCESS';
const AUTOCOMPLETE_FAILURE = 'Search/AUTOCOMPLETE_FAILURE';
const SEARCH               = 'Search/SEARCH';
const SEARCH_SUCCESS       = 'Search/SEARCH_SUCCESS';
const SEARCH_FAILURE       = 'Search/SEARCH_FAILURE';
const CLICK                = 'Search/CLICK';

const SET_PAGE     = 'Search/SET_PAGE';
const SET_SORT_BY  = 'Search/SET_SORT_BY';
const UPDATE_QUERY = 'Search/UPDATE_QUERY';
const SET_DEB      = 'Search/SET_DEB';
const HYDRATE_URL  = 'Search/HYDRATE_URL';

export const types = {
  AUTOCOMPLETE,
  AUTOCOMPLETE_SUCCESS,
  AUTOCOMPLETE_FAILURE,
  SEARCH,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  CLICK,

  SET_PAGE,
  SET_SORT_BY,
  UPDATE_QUERY,
  SET_DEB,
  HYDRATE_URL,
};

/* Actions */

const autocomplete        = createAction(AUTOCOMPLETE);
const autocompleteSuccess = createAction(AUTOCOMPLETE_SUCCESS);
const autocompleteFailure = createAction(AUTOCOMPLETE_FAILURE);
const search              = createAction(SEARCH, (q, pageNo, pageSize, deb=false) =>
                                                 ({q, pageNo, pageSize, deb}));
const searchSuccess       = createAction(SEARCH_SUCCESS);
const searchFailure       = createAction(SEARCH_FAILURE);
const click               = createAction(CLICK, (mdbUid, index, type, rank, searchId) =>
                                                ({mdbUid, index, type, rank, searchId}));
const setPage             = createAction(SET_PAGE);
const setSortBy           = createAction(SET_SORT_BY);
const updateQuery         = createAction(UPDATE_QUERY);
const setDeb              = createAction(SET_DEB);
const hydrateUrl          = createAction(HYDRATE_URL);

export const actions = {
  autocomplete,
  autocompleteSuccess,
  autocompleteFailure,
  search,
  searchSuccess,
  searchFailure,
  click,

  setPage,
  setSortBy,
  updateQuery,
  setDeb,
  hydrateUrl,
};

/* Reducer */

const initialState = {
  acQ: '',
  suggestions: [],
  q: '',
  queryResult: {},
  pageNo: 1,
  sortBy: 'relevance',
  deb: false,
  wip: false,
  error: null,
};

const onSSRPrepare = state => ({
  ...state,
  error: state.error ? state.error.toString() : state.error,
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [AUTOCOMPLETE]: (state, action) => ({
    ...state,
    acQ: action.payload,
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
    queryResult: action.payload,
  }),
  [SEARCH_FAILURE]: (state, action) => ({
    ...state,
    wip: false,
    error: action.payload,
  }),
  [SET_PAGE]: (state, action) => ({
    ...state,
    pageNo: action.payload
  }),
  [SET_SORT_BY]: (state, action) => ({
    ...state,
    sortBy: action.payload
  }),
  [UPDATE_QUERY]: (state, action) => ({
    ...state,
    q: action.payload,
  }),
  [SET_DEB]: (state, action) => ({
    ...state,
    deb: action.payload,
  }),
}, initialState);

/* Selectors */

const getQuery       = state => state.q;
const getSuggestions = state => state.suggestions;
const getQueryResult = state => state.queryResult;
const getPageNo      = state => state.pageNo;
const getSortBy      = state => state.sortBy;
const getDeb         = state => state.deb;
const getWip         = state => state.wip;
const getError       = state => state.error;

export const selectors = {
  getQuery,
  getSuggestions,
  getQueryResult,
  getPageNo,
  getSortBy,
  getDeb,
  getWip,
  getError,
};

