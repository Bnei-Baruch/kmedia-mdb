'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectors = exports.reducer = exports.actions = exports.types = undefined;

var _handleActions;

var _reduxActions = require('redux-actions');

var _consts = require('../../helpers/consts');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* Types */

var SET_LANGUAGE = 'Settings/SET_LANGUAGE';
var SET_PAGE_SIZE = 'Settings/SET_PAGE_SIZE';

var types = exports.types = {
  SET_LANGUAGE: SET_LANGUAGE,
  SET_PAGE_SIZE: SET_PAGE_SIZE
};

/* Actions */

var setLanguage = (0, _reduxActions.createAction)(SET_LANGUAGE);
var setPageSize = (0, _reduxActions.createAction)(SET_PAGE_SIZE);

var actions = exports.actions = {
  setLanguage: setLanguage,
  setPageSize: setPageSize
};

/* Reducer */

var initialState = {
  language: _consts.DEFAULT_LANGUAGE,
  pageSize: 10
};

var reducer = exports.reducer = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, SET_LANGUAGE, function (state, action) {
  return Object.assign({}, state, {
    language: action.payload
  });
}), _defineProperty(_handleActions, SET_PAGE_SIZE, function (state, action) {
  return Object.assign({}, state, {
    pageSize: action.payload
  });
}), _handleActions), initialState);

/* Selectors */

var getLanguage = function getLanguage(state) {
  return state.language;
};
var getPageSize = function getPageSize(state) {
  return state.pageSize;
};

var selectors = exports.selectors = {
  getLanguage: getLanguage,
  getPageSize: getPageSize
};