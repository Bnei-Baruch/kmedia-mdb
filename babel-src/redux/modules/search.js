'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectors = exports.reducer = exports.actions = exports.types = undefined;

var _handleActions;

var _reduxActions = require('redux-actions');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* Types */

var AUTOCOMPLETE = 'Search/AUTOCOMPLETE';
var AUTOCOMPLETE_SUCCESS = 'Search/AUTOCOMPLETE_SUCCESS';
var AUTOCOMPLETE_FAILURE = 'Search/AUTOCOMPLETE_FAILURE';
var SEARCH = 'Search/SEARCH';
var SEARCH_SUCCESS = 'Search/SEARCH_SUCCESS';
var SEARCH_FAILURE = 'Search/SEARCH_FAILURE';

var SET_PAGE = 'Search/SET_PAGE';
var SET_SORT_BY = 'Search/SET_SORT_BY';
var UPDATE_QUERY = 'Search/UPDATE_QUERY';
var HYDRATE_URL = 'Search/HYDRATE_URL';

var types = exports.types = {
  AUTOCOMPLETE: AUTOCOMPLETE,
  AUTOCOMPLETE_SUCCESS: AUTOCOMPLETE_SUCCESS,
  AUTOCOMPLETE_FAILURE: AUTOCOMPLETE_FAILURE,
  SEARCH: SEARCH,
  SEARCH_SUCCESS: SEARCH_SUCCESS,
  SEARCH_FAILURE: SEARCH_FAILURE,

  SET_PAGE: SET_PAGE,
  SET_SORT_BY: SET_SORT_BY,
  UPDATE_QUERY: UPDATE_QUERY,
  HYDRATE_URL: HYDRATE_URL
};

/* Actions */

var autocomplete = (0, _reduxActions.createAction)(AUTOCOMPLETE);
var autocompleteSuccess = (0, _reduxActions.createAction)(AUTOCOMPLETE_SUCCESS);
var autocompleteFailure = (0, _reduxActions.createAction)(AUTOCOMPLETE_FAILURE);
var search = (0, _reduxActions.createAction)(SEARCH, function (q, pageNo, pageSize) {
  return { q: q, pageNo: pageNo, pageSize: pageSize };
});
var searchSuccess = (0, _reduxActions.createAction)(SEARCH_SUCCESS);
var searchFailure = (0, _reduxActions.createAction)(SEARCH_FAILURE);
var setPage = (0, _reduxActions.createAction)(SET_PAGE);
var setSortBy = (0, _reduxActions.createAction)(SET_SORT_BY);
var updateQuery = (0, _reduxActions.createAction)(UPDATE_QUERY);
var hydrateUrl = (0, _reduxActions.createAction)(HYDRATE_URL);

var actions = exports.actions = {
  autocomplete: autocomplete,
  autocompleteSuccess: autocompleteSuccess,
  autocompleteFailure: autocompleteFailure,
  search: search,
  searchSuccess: searchSuccess,
  searchFailure: searchFailure,

  setPage: setPage,
  setSortBy: setSortBy,
  updateQuery: updateQuery,
  hydrateUrl: hydrateUrl
};

/* Reducer */

var initialState = {
  acQ: '',
  suggestions: [],
  q: '',
  results: {},
  pageNo: 1,
  sortBy: 'relevance',
  wip: false,
  err: null
};

var reducer = exports.reducer = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, AUTOCOMPLETE, function (state, action) {
  return Object.assign({}, state, {
    acQ: action.payload
  });
}), _defineProperty(_handleActions, AUTOCOMPLETE_SUCCESS, function (state, action) {
  return Object.assign({}, state, {
    suggestions: action.payload
  });
}), _defineProperty(_handleActions, AUTOCOMPLETE_FAILURE, function (state, action) {
  return Object.assign({}, state, {
    suggestions: null
  });
}), _defineProperty(_handleActions, SEARCH, function (state, action) {
  return Object.assign({}, state, action.payload, {
    wip: true
  });
}), _defineProperty(_handleActions, SEARCH_SUCCESS, function (state, action) {
  return Object.assign({}, state, {
    wip: false,
    error: null,
    results: action.payload
  });
}), _defineProperty(_handleActions, SEARCH_FAILURE, function (state, action) {
  return Object.assign({}, state, {
    wip: false,
    error: action.payload
  });
}), _defineProperty(_handleActions, SET_PAGE, function (state, action) {
  return Object.assign({}, state, {
    pageNo: action.payload
  });
}), _defineProperty(_handleActions, SET_SORT_BY, function (state, action) {
  return Object.assign({}, state, {
    sortBy: action.payload
  });
}), _defineProperty(_handleActions, UPDATE_QUERY, function (state, action) {
  return Object.assign({}, state, {
    q: action.payload
  });
}), _handleActions), initialState);

/* Selectors */

var getQuery = function getQuery(state) {
  return state.q;
};
var getSuggestions = function getSuggestions(state) {
  return state.suggestions;
};
var getResults = function getResults(state) {
  return state.results;
};
var getPageNo = function getPageNo(state) {
  return state.pageNo;
};
var getSortBy = function getSortBy(state) {
  return state.sortBy;
};
var getWip = function getWip(state) {
  return state.wip;
};
var getError = function getError(state) {
  return state.error;
};

var selectors = exports.selectors = {
  getQuery: getQuery,
  getSuggestions: getSuggestions,
  getResults: getResults,
  getPageNo: getPageNo,
  getSortBy: getSortBy,
  getWip: getWip,
  getError: getError
};