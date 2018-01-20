'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectors = exports.reducer = exports.actions = exports.types = undefined;

var _handleActions;

var _reduxActions = require('redux-actions');

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

var _utils = require('../../helpers/utils');

var _settings = require('./settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* Types */

var FETCH_TAGS = 'Tags/FETCH_TAGS';
var FETCH_TAGS_SUCCESS = 'Tags/FETCH_TAGS_SUCCESS';
var FETCH_TAGS_FAILURE = 'Tags/FETCH_TAGS_FAILURE';

var types = exports.types = {
  FETCH_TAGS: FETCH_TAGS,
  FETCH_TAGS_SUCCESS: FETCH_TAGS_SUCCESS,
  FETCH_TAGS_FAILURE: FETCH_TAGS_FAILURE
};

/* Actions */

var fetchTags = (0, _reduxActions.createAction)(FETCH_TAGS);
var fetchTagsSuccess = (0, _reduxActions.createAction)(FETCH_TAGS_SUCCESS);
var fetchTagsFailure = (0, _reduxActions.createAction)(FETCH_TAGS_FAILURE);

var actions = exports.actions = {
  fetchTags: fetchTags,
  fetchTagsSuccess: fetchTagsSuccess,
  fetchTagsFailure: fetchTagsFailure
};

/* Reducer */

var initialState = {
  byId: {},
  roots: [],
  tags: {},
  tagIdsByPattern: {},
  error: null,
  getByID: _identity2.default
};

var buildById = function buildById(items) {
  var byId = {};

  // We BFS the tree, extracting each item by it's ID
  // and normalizing it's children
  var s = [].concat(_toConsumableArray(items));
  while (s.length > 0) {
    var node = s.pop();
    if (node.children) {
      s = s.concat(node.children);
    }
    byId[node.id] = Object.assign({}, node, {
      children: node.children ? node.children.map(function (x) {
        return x.id;
      }) : node
    });
  }

  return byId;
};

var reducer = exports.reducer = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, _settings.types.SET_LANGUAGE, function () {
  return initialState;
}), _defineProperty(_handleActions, FETCH_TAGS_SUCCESS, function (state, action) {
  var byId = buildById(action.payload);

  // selectors
  // we keep those in state to avoid recreating them every time a selector is called
  var getByID = function getByID(id) {
    return byId[id];
  };
  var getPath = function getPath(source) {
    return (0, _utils.tracePath)(source, getByID);
  };
  var getPathByID = function getPathByID(id) {
    return getPath(getByID(id));
  };

  return Object.assign({}, state, {
    byId: byId,
    getByID: getByID,
    getPath: getPath,
    getPathByID: getPathByID,
    roots: action.payload.map(function (x) {
      return x.id;
    }),
    error: null
  });
}), _defineProperty(_handleActions, FETCH_TAGS_FAILURE, function (state, action) {
  return Object.assign({}, state, {
    error: action.payload
  });
}), _handleActions), initialState);

/* Selectors */

var getTags = function getTags(state) {
  return state.byId;
};
var getRoots = function getRoots(state) {
  return state.roots;
};
var getTagById = function getTagById(state) {
  return state.getByID;
};
var getPath = function getPath(state) {
  return state.getPath;
};
var getPathByID = function getPathByID(state) {
  return state.getPathByID;
};

var selectors = exports.selectors = {
  getTags: getTags,
  getRoots: getRoots,
  getTagById: getTagById,
  getPath: getPath,
  getPathByID: getPathByID
};