import { createAction } from 'redux-actions';

import { handleActions } from './settings';
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
const SET_SUGGEST  = 'Search/SET_SUGGEST';
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
const search              = createAction(SEARCH, (q, pageNo, pageSize, suggest = '', deb = false) => ({ q, pageNo, pageSize, suggest, deb }));
const searchSuccess       = createAction(SEARCH_SUCCESS);
const searchFailure       = createAction(SEARCH_FAILURE);
const click               = createAction(CLICK, (mdbUid, index, type, rank, searchId, deb = false) => ({ mdbUid, index, type, rank, searchId, deb }));
const setPage             = createAction(SET_PAGE);
const setSortBy           = createAction(SET_SORT_BY);
const updateQuery         = createAction(UPDATE_QUERY);
const setDeb              = createAction(SET_DEB);
const setSuggest          = createAction(SET_SUGGEST);
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
  setSuggest,
  hydrateUrl,
};

/* Reducer */

const initialState = {
  acQ: '',
  suggestions: {},
  q: '',
  queryResult: {},
  pageNo: 1,
  sortBy: 'relevance',
  deb: false,
  wip: false,
  error: null,
};

const onSSRPrepare = draft => {
  if (draft.error) {
    draft.error = draft.error.toString();
  }
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [AUTOCOMPLETE]: (draft, payload) => {
    draft.acQ = payload;
  },
  [AUTOCOMPLETE_SUCCESS]: (draft, payload) => {
    draft.suggestions = payload;
  },
  [AUTOCOMPLETE_FAILURE]: draft => {
    draft.suggestions = null;
  },
  [SEARCH]: (draft, payload) => {
    Object.keys(payload).forEach(key => {
      draft[key] = payload[key];
    });
    draft.wip = true;
  },
  [SEARCH_SUCCESS]: (draft, payload) => {
    draft.wip         = false;
    draft.error       = null;
    draft.queryResult = payload;
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
    draft.q = payload;
  },
  [SET_DEB]: (draft, payload) => {
    draft.deb = payload;
  },
  [SET_SUGGEST]: (draft, payload) => {
    draft.suggest = payload;
  },
}, initialState);

/* Selectors */

const getQuery       = state => state.q;
const getSuggestions = state => state.suggestions;
const getQueryResult = state => state.queryResult;
const getPageNo      = state => state.pageNo;
const getSortBy      = state => state.sortBy;
const getDeb         = state => state.deb;
const getSuggest     = state => state.suggest;
const getWip         = state => state.wip;
const getError       = state => state.error;

export const selectors = {
  getQuery,
  getSuggestions,
  getQueryResult,
  getPageNo,
  getSortBy,
  getDeb,
  getSuggest,
  getWip,
  getError,
};
