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

var FETCH_SOURCES = 'Sources/FETCH_SOURCES';
var FETCH_SOURCES_SUCCESS = 'Sources/FETCH_SOURCES_SUCCESS';
var FETCH_SOURCES_FAILURE = 'Sources/FETCH_SOURCES_FAILURE';
var FETCH_INDEX = 'Sources/FETCH_INDEX';
var FETCH_INDEX_SUCCESS = 'Sources/FETCH_INDEX_SUCCESS';
var FETCH_INDEX_FAILURE = 'Sources/FETCH_INDEX_FAILURE';
var FETCH_CONTENT = 'Sources/FETCH_CONTENT';
var FETCH_CONTENT_SUCCESS = 'Sources/FETCH_CONTENT_SUCCESS';
var FETCH_CONTENT_FAILURE = 'Sources/FETCH_CONTENT_FAILURE';

var types = exports.types = {
  FETCH_SOURCES: FETCH_SOURCES,
  FETCH_SOURCES_SUCCESS: FETCH_SOURCES_SUCCESS,
  FETCH_SOURCES_FAILURE: FETCH_SOURCES_FAILURE,
  FETCH_INDEX: FETCH_INDEX,
  FETCH_INDEX_SUCCESS: FETCH_INDEX_SUCCESS,
  FETCH_INDEX_FAILURE: FETCH_INDEX_FAILURE,
  FETCH_CONTENT: FETCH_CONTENT,
  FETCH_CONTENT_SUCCESS: FETCH_CONTENT_SUCCESS,
  FETCH_CONTENT_FAILURE: FETCH_CONTENT_FAILURE
};

/* Actions */

var fetchSources = (0, _reduxActions.createAction)(FETCH_SOURCES);
var fetchSourcesSuccess = (0, _reduxActions.createAction)(FETCH_SOURCES_SUCCESS);
var fetchSourcesFailure = (0, _reduxActions.createAction)(FETCH_SOURCES_FAILURE);
var fetchIndex = (0, _reduxActions.createAction)(FETCH_INDEX);
var fetchIndexSuccess = (0, _reduxActions.createAction)(FETCH_INDEX_SUCCESS, function (id, data) {
  return { id: id, data: data };
});
var fetchIndexFailure = (0, _reduxActions.createAction)(FETCH_INDEX_FAILURE, function (id, err) {
  return { id: id, err: err };
});
var fetchContent = (0, _reduxActions.createAction)(FETCH_CONTENT, function (id, name) {
  return { id: id, name: name };
});
var fetchContentSuccess = (0, _reduxActions.createAction)(FETCH_CONTENT_SUCCESS);
var fetchContentFailure = (0, _reduxActions.createAction)(FETCH_CONTENT_FAILURE);

var actions = exports.actions = {
  fetchSources: fetchSources,
  fetchSourcesSuccess: fetchSourcesSuccess,
  fetchSourcesFailure: fetchSourcesFailure,
  fetchIndex: fetchIndex,
  fetchIndexSuccess: fetchIndexSuccess,
  fetchIndexFailure: fetchIndexFailure,
  fetchContent: fetchContent,
  fetchContentSuccess: fetchContentSuccess,
  fetchContentFailure: fetchContentFailure
};

/* Reducer */

var initialState = {
  byId: {},
  roots: [],
  error: null,
  getByID: _identity2.default,
  indexById: {},
  content: {
    data: null,
    wip: false,
    err: null
  }
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

var reducer = exports.reducer = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, _settings.types.SET_LANGUAGE, function (state) {
  var indexById = state.indexById || initialState.indexById;
  return Object.assign({}, initialState, {
    indexById: indexById
  });
}), _defineProperty(_handleActions, FETCH_SOURCES_SUCCESS, function (state, action) {
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
}), _defineProperty(_handleActions, FETCH_SOURCES_FAILURE, function (state, action) {
  return Object.assign({}, state, {
    error: action.payload
  });
}), _defineProperty(_handleActions, FETCH_INDEX, function (state, action) {
  return Object.assign({}, state, {
    indexById: Object.assign({}, state.indexById, _defineProperty({}, action.payload, { wip: true }))
  });
}), _defineProperty(_handleActions, FETCH_INDEX_SUCCESS, function (state, action) {
  var _action$payload = action.payload,
      id = _action$payload.id,
      data = _action$payload.data;

  return Object.assign({}, state, {
    indexById: Object.assign({}, state.indexById, _defineProperty({}, id, { data: data, wip: false, err: null }))
  });
}), _defineProperty(_handleActions, FETCH_INDEX_FAILURE, function (state, action) {
  var _action$payload2 = action.payload,
      id = _action$payload2.id,
      err = _action$payload2.err;

  return Object.assign({}, state, {
    indexById: Object.assign({}, state.indexById, _defineProperty({}, id, { err: err, wip: false }))
  });
}), _defineProperty(_handleActions, FETCH_CONTENT, function (state, action) {
  return Object.assign({}, state, {
    content: { wip: true }
  });
}), _defineProperty(_handleActions, FETCH_CONTENT_SUCCESS, function (state, action) {
  return Object.assign({}, state, {
    content: { data: action.payload, wip: false, err: null }
  });
}), _defineProperty(_handleActions, FETCH_CONTENT_FAILURE, function (state, action) {
  return Object.assign({}, state, {
    content: { wip: false, err: action.payload }
  });
}), _handleActions), initialState);

/* Selectors */

var getSources = function getSources(state) {
  return state.byId;
};
var getRoots = function getRoots(state) {
  return state.roots;
};
var getSourceById = function getSourceById(state) {
  return state.getByID;
};
var getPath = function getPath(state) {
  return state.getPath;
};
var getPathByID = function getPathByID(state) {
  return state.getPathByID;
};
var getIndexById = function getIndexById(state) {
  return state.indexById;
};
var getContent = function getContent(state) {
  return state.content;
};

var selectors = exports.selectors = {
  getSources: getSources,
  getRoots: getRoots,
  getSourceById: getSourceById,
  getPath: getPath,
  getPathByID: getPathByID,
  getIndexById: getIndexById,
  getContent: getContent
};