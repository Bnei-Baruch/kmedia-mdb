import { createSlice } from '@reduxjs/toolkit';

import { actions as ssrActions } from './ssr';

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
  error: null
};

const searchSlice = createSlice({
  name: 'search',
  initialState,

  reducers: {
    autocompleteSuccess: (state, { payload: { suggestions } }) => {
      state.suggestions     = suggestions;
      state.autocompleteWip = false;
    },
    autocompleteFailure: state => {
      state.suggestions     = null;
      state.autocompleteWip = false;
    },
    setWip: state => {
      state.wip = true;
    },
    search: () => void ({}),
    searchSuccess: (state, { payload }) => {
      state.wip              = false;
      state.error            = null;
      state.queryResult      = payload.searchResults;
      state.prevFilterParams = payload.filterParams;
      state.prevQuery        = payload.query;
      state.pageNo           = payload.pageNo;
    },
    searchFailure: {
      prepare: ({ payload }) => ({ error: payload }),
      reducer: (state, payload) => {
        state.wip   = false;
        state.error = payload?.error;
      }
    },
    hydrateUrl: () => ({}),
    setPage: (state, { payload }) => void (state.pageNo = payload),
    setSortBy: (state, { payload }) => void (state.sortBy = payload),
    updateQuery: (state, { payload }) => {
      state.autocompleteWip = payload.autocomplete;
      state.q               = payload.query;
    },
    setDeb: (state, { payload }) => void (state.deb = payload)
  },
  extraReducers: builder => {
    builder.addCase(ssrActions.prepare, state => {
      if (state.error) {
        state.error = state.error.toString();
      }
    });
  },

  selectors: {
    getAutocompleteWip : state => state.autocompleteWip,
    getDeb             : state => state.deb,
    getError           : state => state.error,
    getPageNo          : state => state.pageNo,
    getPrevFilterParams: state => state.prevFilterParams,
    getQuery           : state => state.q,
    getPrevQuery       : state => state.prevQuery,
    getQueryResult     : state => state.queryResult,
    getSortBy          : state => state.sortBy,
    getSuggestions     : state => state.suggestions,
    getWip             : state => state.wip
  }
});

export default searchSlice.reducer;

export const { actions } = searchSlice;

export const types = Object.fromEntries(new Map(
  Object.values(searchSlice.actions).map(a => [a.type, a.type])
));

export const selectors = searchSlice.getSelectors();
