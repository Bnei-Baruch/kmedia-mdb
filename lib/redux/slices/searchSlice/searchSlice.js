import { createAction, handleActions } from 'redux-actions';
import { types as ssr } from '../../../../src/redux/modules/ssr';
import { createSlice } from '@reduxjs/toolkit';
import { fetchTags } from '../tagsSlice';

/* Types */
const AUTOCOMPLETE_FAILURE = 'Search/AUTOCOMPLETE_FAILURE';
const AUTOCOMPLETE_SUCCESS = 'Search/AUTOCOMPLETE_SUCCESS';
const HYDRATE_URL    = 'Search/HYDRATE_URL';
const SearchSlice    = 'Search/SEARCH';
const SEARCH_FAILURE = 'Search/SEARCH_FAILURE';
const SEARCH_SUCCESS       = 'Search/SEARCH_SUCCESS';
const SET_DEB              = 'Search/SET_DEB';
const SET_PAGE             = 'Search/SET_PAGE';
const SET_SORT_BY          = 'Search/SET_SORT_BY';
const SET_WIP              = 'Search/SET_WIP';
const UPDATE_QUERY         = 'Search/UPDATE_QUERY';

export const types = {
  AUTOCOMPLETE_FAILURE,
  AUTOCOMPLETE_SUCCESS,
  HYDRATE_URL,
  SEARCH: SearchSlice,
  SEARCH_FAILURE,
  SEARCH_SUCCESS,
  SET_DEB,
  SET_PAGE,
  SET_SORT_BY,
  SET_WIP,
  UPDATE_QUERY,
};

/* Actions */
const autocompleteFailure = createAction(AUTOCOMPLETE_FAILURE);
const autocompleteSuccess = createAction(AUTOCOMPLETE_SUCCESS);
const hydrateUrl          = createAction(HYDRATE_URL);
const search              = createAction(SearchSlice);
const searchFailure       = createAction(SEARCH_FAILURE);
const searchSuccess       = createAction(SEARCH_SUCCESS);
const setDeb              = createAction(SET_DEB);
const setPage             = createAction(SET_PAGE);
const setSortBy           = createAction(SET_SORT_BY);
const setWip              = createAction(SET_WIP);
const updateQuery         = createAction(UPDATE_QUERY);

export const actions = {
  autocompleteFailure,
  autocompleteSuccess,
  hydrateUrl,
  search,
  searchFailure,
  searchSuccess,
  setDeb,
  setPage,
  setSortBy,
  setWip,
  updateQuery,
};

/* Reducer */

const initialState = {
  suggestions: {},
  q: '',
  prevQuery: '',
  prevFilterParams: '',
  queryResult: {},
  pageNo: 1,
  sortBy: 'relevance',
  deb: false,
  wip: false,
  autocompleteWip: false,
  error: null,
};

const onSSRPrepare = draft => {
  if (draft.error) {
    draft.error = draft.error.toString();
  }
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [AUTOCOMPLETE_SUCCESS]: (draft, payload) => {
    draft.suggestions = payload.suggestions;
    draft.autocompleteWip = false;
  },
  [AUTOCOMPLETE_FAILURE]: draft => {
    draft.suggestions = null;
    draft.autocompleteWip = false;
  },
  [SET_WIP]: (draft, payload) => {
    draft.wip = true;
  },
  [SEARCH_SUCCESS]: (draft, payload) => {
    draft.wip              = false;
    draft.error            = null;
    draft.queryResult      = payload.searchResults;
    draft.prevFilterParams = payload.filterParams;
    draft.prevQuery        = payload.query;
  },
  [SEARCH_FAILURE]: (draft, payload) => {
    draft.wip   = false;
    draft.error = payload;
  },
  [SET_PAGE]: (draft, payload) => {
    draft.pageNo = payload;
  },
  [SET_SORT_BY]: (draft, payload) => {
    draft.sortBy = payload;
  },
  [UPDATE_QUERY]: (draft, payload) => {
    draft.autocompleteWip = payload.autocomplete;
    draft.q = payload.query;
  },
  [SET_DEB]: (draft, payload) => {
    draft.deb = payload;
  },
}, initialState);



export const tagsSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    autocompleteFailure,
    autocompleteSuccess,
    hydrateUrl,
    search,
    searchFailure,
    searchSuccess,
    setDeb,
    setPage,
    setSortBy,
    setWip,
    updateQuery,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTags.fulfilled, onDashboardSuccess);
    builder.addCase(fetchTags.rejected, onFetchDashboardFailure);
  }
});

/* Selectors */
const getAutocompleteWip  = state => state.autocompleteWip;
const getDeb              = state => state.deb;
const getError            = state => state.error;
const getPageNo           = state => state.pageNo;
const getPrevFilterParams = state => state.prevFilterParams;
const getQuery            = state => state.q;
const getPrevQuery        = state => state.prevQuery;
const getQueryResult      = state => state.queryResult;
const getSortBy           = state => state.sortBy;
const getSuggestions      = state => state.suggestions;
const getWip              = state => state.wip;

export const selectors = {
  getAutocompleteWip,
  getDeb,
  getError,
  getPageNo,
  getPrevFilterParams,
  getQuery,
  getPrevQuery,
  getQueryResult,
  getSortBy,
  getSuggestions,
  getWip,
};
