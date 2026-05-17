import { createSlice } from '@reduxjs/toolkit';

import { actions as ssrActions } from './ssr';

export const SEARCH_TYPES = {
  REGULAR: 'regular',
  AGENTIC: 'agentic',
  AGENTIC_RAPID: 'agentic_rapid'
};

export const isAgenticSearchType = searchType => (
  searchType === SEARCH_TYPES.AGENTIC || searchType === SEARCH_TYPES.AGENTIC_RAPID
);

const createReasoningSearchState = () => ({
  result: null,
  previousResults: [],
  status: null,
  requestKind: null,
  wip: false
});

const getReasoningSearchType = searchType => (
  isAgenticSearchType(searchType) ? searchType : SEARCH_TYPES.AGENTIC
);

const getReasoningSearchState = state => (
  state.reasoningByType?.[getReasoningSearchType(state.searchType)] || createReasoningSearchState()
);

const getReasoningSearchStateForPayload = (state, payload) => {
  const searchType = getReasoningSearchType(payload?.searchType || state.searchType);
  if (!state.reasoningByType) {
    state.reasoningByType = {};
  }

  if (!state.reasoningByType[searchType]) {
    state.reasoningByType[searchType] = createReasoningSearchState();
  }

  return state.reasoningByType[searchType];
};

const getSearchFailurePayload = payload => (
  payload && Object.prototype.hasOwnProperty.call(payload, 'error')
    ? payload
    : { error: payload }
);

const dedupePreviousAgenticResults = results => {
  const seen = new Set();
  return (Array.isArray(results) ? results : []).filter(result => {
    const mdbUid = result?.mdb_uid;
    if (!mdbUid || seen.has(mdbUid)) {
      return false;
    }

    seen.add(mdbUid);
    return true;
  });
};

const initialState = {
  suggestions: {},
  q: '',
  prevQuery: '',
  prevFilterParams: '',
  queryResult: {},
  searchRequest: null,
  reasoningByType: {
    [SEARCH_TYPES.AGENTIC]: createReasoningSearchState(),
    [SEARCH_TYPES.AGENTIC_RAPID]: createReasoningSearchState()
  },
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
      const reasoningState = getReasoningSearchStateForPayload(state, payload);
      reasoningState.wip   = true;
      state.error          = null;
      if (!payload?.keepResult) {
        reasoningState.result          = null;
        reasoningState.previousResults = [];
      }

      reasoningState.requestKind = payload?.requestKind || 'initial';
      reasoningState.status = {
        session_id: payload?.sessionId,
        state     : 'pending',
        phase     : 'pending',
        done      : false,
        query     : payload?.query
      };
    },
    reasoningFollowup: () => void ({}),
    reasoningCancel: (state, { payload } = {}) => {
      const reasoningState = getReasoningSearchStateForPayload(state, payload);
      reasoningState.wip         = false;
      state.error                = null;
      reasoningState.requestKind = null;
      reasoningState.status = {
        session_id: reasoningState.status?.session_id,
        state     : 'canceled',
        phase     : 'canceled',
        done      : true
      };
    },
    reasoningFinishNow: () => void ({}),
    searchSuccess: (state, { payload }) => {
      state.wip              = false;
      state.error            = null;
      state.queryResult      = payload.searchResults;
      state.searchRequest    = payload.searchRequest || null;
      state.prevFilterParams = payload.filterParams;
      state.prevQuery        = payload.query;
      state.pageNo           = payload.pageNo;
    },
    reasoningSearchSuccess: (state, { payload }) => {
      const reasoningState = getReasoningSearchStateForPayload(state, payload);
      const nextResults = Array.isArray(payload.searchResults?.results) ? payload.searchResults.results : [];
      if (reasoningState.requestKind === 'followup') {
        const nextResultIds = new Set(nextResults.map(result => result?.mdb_uid).filter(Boolean));
        const currentResults = Array.isArray(reasoningState.result?.results) ? reasoningState.result.results : [];

        reasoningState.previousResults = dedupePreviousAgenticResults([
          ...currentResults.filter(result => result?.mdb_uid && !nextResultIds.has(result.mdb_uid)),
          ...reasoningState.previousResults.filter(result => result?.mdb_uid && !nextResultIds.has(result.mdb_uid))
        ]);
      } else {
        reasoningState.previousResults = [];
      }

      reasoningState.wip         = false;
      state.error                = null;
      reasoningState.result      = payload.searchResults;
      reasoningState.requestKind = null;
      reasoningState.status = {
        session_id: payload.searchResults.session_id || reasoningState.status?.session_id,
        state     : 'completed',
        phase     : 'done',
        done      : true
      };
      state.prevQuery       = payload.query;
      state.pageNo          = 1;
    },
    reasoningStatusUpdate: (state, { payload }) => {
      const { searchType, ...status } = payload || {};
      const reasoningState = getReasoningSearchStateForPayload(state, payload);
      reasoningState.status = {
        ...status,
        query: status.query || reasoningState.status?.query
      };
      if (status?.state === 'canceled' || status?.phase === 'canceled') {
        reasoningState.wip = false;
        reasoningState.requestKind = null;
      }
    },
    searchFailure: (state, { payload }) => {
      const failure = getSearchFailurePayload(payload);
      if (isAgenticSearchType(failure.searchType)) {
        const reasoningState = getReasoningSearchStateForPayload(state, failure);
        reasoningState.wip = false;
        reasoningState.requestKind = null;
        if (state.searchType === failure.searchType) {
          state.error = null;
        }
        return;
      }

      state.wip   = false;
      state.error = failure.error;
    },
    hydrateUrl: () => ({}),
    setPage: (state, { payload }) => void (state.pageNo = payload),
    setSortBy: (state, { payload }) => void (state.sortBy = payload),
    setSearchType: (state, { payload }) => {
      state.searchType = isAgenticSearchType(payload) ? payload : SEARCH_TYPES.REGULAR;
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
    getReasoningPreviousResults: state => getReasoningSearchState(state).previousResults,
    getReasoningResult : state => getReasoningSearchState(state).result,
    getReasoningStatus : state => getReasoningSearchState(state).status,
    getSearchType      : state => state.searchType,
    getSortBy          : state => state.sortBy,
    getSuggestions     : state => state.suggestions,
    getWip             : state => isAgenticSearchType(state.searchType) ? getReasoningSearchState(state).wip : state.wip
  }
});

export default searchSlice.reducer;

export const { actions } = searchSlice;

export const types = Object.fromEntries(new Map(
  Object.values(searchSlice.actions).map(a => [a.type, a.type])
));

export const selectors = searchSlice.getSelectors();
