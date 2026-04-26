import { createSlice } from '@reduxjs/toolkit';

import { actions as ssrActions } from './ssr';

export const SEARCH_TYPES = {
  REGULAR: 'regular',
  AGENTIC: 'agentic'
};

const initialState = {
  suggestions: {},
  q: '',
  prevQuery: '',
  prevFilterParams: '',
  queryResult: {},
  reasoningResult: null,
  reasoningStatus: null,
  searchType: SEARCH_TYPES.REGULAR,
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
    reasoningSearchStart: (state, { payload } = {}) => {
      state.wip             = true;
      state.error           = null;
      if (!payload?.keepResult) {
        state.reasoningResult = null;
      }

      state.reasoningStatus = {
        session_id: payload?.sessionId,
        state     : 'pending',
        phase     : 'pending',
        done      : false
      };
    },
    reasoningFollowup: () => void ({}),
    searchSuccess: (state, { payload }) => {
      state.wip              = false;
      state.error            = null;
      state.queryResult      = payload.searchResults;
      state.prevFilterParams = payload.filterParams;
      state.prevQuery        = payload.query;
      state.pageNo           = payload.pageNo;
    },
    reasoningSearchSuccess: (state, { payload }) => {
      state.wip             = false;
      state.error           = null;
      state.reasoningResult = payload.searchResults;
      state.reasoningStatus = {
        session_id: payload.searchResults.session_id || state.reasoningStatus?.session_id,
        state     : 'completed',
        phase     : 'done',
        done      : true
      };
      state.prevQuery       = payload.query;
      state.pageNo          = 1;
    },
    reasoningStatusUpdate: (state, { payload }) => {
      state.reasoningStatus = payload;
    },
    searchFailure: (state, { payload }) => {
      state.wip   = false;
      state.error = payload;
    },
    hydrateUrl: () => ({}),
    setPage: (state, { payload }) => void (state.pageNo = payload),
    setSortBy: (state, { payload }) => void (state.sortBy = payload),
    setSearchType: (state, { payload }) => {
      state.searchType = payload === SEARCH_TYPES.AGENTIC ? SEARCH_TYPES.AGENTIC : SEARCH_TYPES.REGULAR;
      state.pageNo     = 1;
    },
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
    getReasoningResult : state => state.reasoningResult,
    getReasoningStatus : state => state.reasoningStatus,
    getSearchType      : state => state.searchType,
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
