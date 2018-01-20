'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectors = exports.reducer = exports.actions = exports.types = undefined;

var _handleActions;

var _reduxActions = require('redux-actions');

var _settings = require('./settings');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* Types */

var SET_PAGE = 'Lessons/SET_PAGE';

var FETCH_LIST = 'Lessons/FETCH_LIST';
var FETCH_LIST_SUCCESS = 'Lessons/FETCH_LIST_SUCCESS';
var FETCH_LIST_FAILURE = 'Lessons/FETCH_LIST_FAILURE';
var FETCH_LESSON_PART = 'Lesson/FETCH_LESSON_PART';
var FETCH_LESSON_PART_SUCCESS = 'Lesson/FETCH_LESSON_PART_SUCCESS';
var FETCH_LESSON_PART_FAILURE = 'Lesson/FETCH_LESSON_PART_FAILURE';
var FETCH_FULL_LESSON = 'Lesson/FETCH_FULL_LESSON';
var FETCH_FULL_LESSON_SUCCESS = 'Lesson/FETCH_FULL_LESSON_SUCCESS';
var FETCH_FULL_LESSON_FAILURE = 'Lesson/FETCH_FULL_LESSON_FAILURE';

var types = exports.types = {
  SET_PAGE: SET_PAGE,
  FETCH_LIST: FETCH_LIST,
  FETCH_LIST_SUCCESS: FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE: FETCH_LIST_FAILURE,
  FETCH_LESSON_PART: FETCH_LESSON_PART,
  FETCH_LESSON_PART_SUCCESS: FETCH_LESSON_PART_SUCCESS,
  FETCH_LESSON_PART_FAILURE: FETCH_LESSON_PART_FAILURE,
  FETCH_FULL_LESSON: FETCH_FULL_LESSON,
  FETCH_FULL_LESSON_SUCCESS: FETCH_FULL_LESSON_SUCCESS,
  FETCH_FULL_LESSON_FAILURE: FETCH_FULL_LESSON_FAILURE
};

/* Actions */

var setPage = (0, _reduxActions.createAction)(SET_PAGE);
var fetchList = (0, _reduxActions.createAction)(FETCH_LIST, function (_ref) {
  var pageNo = _ref.pageNo,
      language = _ref.language,
      pageSize = _ref.pageSize;
  return {
    pageNo: pageNo,
    language: language,
    pageSize: pageSize
  };
}, function () {
  return { deferred: true };
});
var fetchListSuccess = (0, _reduxActions.createAction)(FETCH_LIST_SUCCESS);
var fetchListFailure = (0, _reduxActions.createAction)(FETCH_LIST_FAILURE);
var fetchLessonPart = (0, _reduxActions.createAction)(FETCH_LESSON_PART);
var fetchLessonPartSuccess = (0, _reduxActions.createAction)(FETCH_LESSON_PART_SUCCESS);
var fetchLessonPartFailure = (0, _reduxActions.createAction)(FETCH_LESSON_PART_FAILURE, function (id, err) {
  return { id: id, err: err };
});
var fetchFullLesson = (0, _reduxActions.createAction)(FETCH_FULL_LESSON);
var fetchFullLessonSuccess = (0, _reduxActions.createAction)(FETCH_FULL_LESSON_SUCCESS);
var fetchFullLessonFailure = (0, _reduxActions.createAction)(FETCH_FULL_LESSON_FAILURE, function (id, err) {
  return { id: id, err: err };
});

var actions = exports.actions = {
  setPage: setPage,
  fetchList: fetchList,
  fetchListSuccess: fetchListSuccess,
  fetchListFailure: fetchListFailure,
  fetchLessonPart: fetchLessonPart,
  fetchLessonPartSuccess: fetchLessonPartSuccess,
  fetchLessonPartFailure: fetchLessonPartFailure,
  fetchFullLesson: fetchFullLesson,
  fetchFullLessonSuccess: fetchFullLessonSuccess,
  fetchFullLessonFailure: fetchFullLessonFailure
};

/* Reducer */

var initialState = {
  total: 0,
  items: [],
  pageNo: 1,
  wip: {
    list: false,
    parts: {},
    fulls: {}
  },
  errors: {
    list: null,
    parts: {},
    fulls: {}
  }
};

/**
 * Set the wip and errors part of the state
 * @param state
 * @param action
 * @returns {{wip: {}, errors: {}}}
 */
var setStatus = function setStatus(state, action) {
  var wip = Object.assign({}, state.wip);
  var errors = Object.assign({}, state.errors);

  switch (action.type) {
    case FETCH_LIST:
      wip.list = true;
      break;
    case FETCH_LESSON_PART:
      wip.parts = Object.assign({}, wip.parts, _defineProperty({}, action.payload, true));
      break;
    case FETCH_FULL_LESSON:
      wip.fulls = Object.assign({}, wip.fulls, _defineProperty({}, action.payload, true));
      break;
    case FETCH_LIST_SUCCESS:
      wip.list = false;
      errors.list = null;
      break;
    case FETCH_LESSON_PART_SUCCESS:
      wip.parts = Object.assign({}, wip.parts, _defineProperty({}, action.payload, false));
      errors.parts = Object.assign({}, errors.parts, _defineProperty({}, action.payload, null));
      break;
    case FETCH_FULL_LESSON_SUCCESS:
      wip.fulls = Object.assign({}, wip.fulls, _defineProperty({}, action.payload, false));
      errors.fulls = Object.assign({}, errors.fulls, _defineProperty({}, action.payload, null));
      break;
    case FETCH_LIST_FAILURE:
      wip.list = false;
      errors.list = action.payload;
      break;
    case FETCH_LESSON_PART_FAILURE:
      wip.parts = Object.assign({}, wip.parts, _defineProperty({}, action.payload.id, false));
      errors.parts = Object.assign({}, errors.parts, _defineProperty({}, action.payload.id, action.payload.err));
      break;
    case FETCH_FULL_LESSON_FAILURE:
      wip.fulls = Object.assign({}, wip.fulls, _defineProperty({}, action.payload.id, false));
      errors.fulls = Object.assign({}, errors.fulls, _defineProperty({}, action.payload.id, action.payload.err));
      break;
    default:
      break;
  }

  return Object.assign({}, state, {
    wip: wip,
    errors: errors
  });
};

var onFetchListSuccess = function onFetchListSuccess(state, action) {
  var items = action.payload.collections || action.payload.content_units || [];
  return Object.assign({}, setStatus(state, action), {
    total: action.payload.total,
    items: items.map(function (x) {
      return [x.id, x.content_type];
    })
  });
};

var onSetPage = function onSetPage(state, action) {
  return Object.assign({}, state, {
    pageNo: action.payload
  });
};

var onSetLanguage = function onSetLanguage(state) {
  return Object.assign({}, state, {
    items: []
  });
};

var reducer = exports.reducer = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, _settings.types.SET_LANGUAGE, onSetLanguage), _defineProperty(_handleActions, FETCH_LIST, setStatus), _defineProperty(_handleActions, FETCH_LIST_SUCCESS, onFetchListSuccess), _defineProperty(_handleActions, FETCH_LIST_FAILURE, setStatus), _defineProperty(_handleActions, FETCH_LESSON_PART, setStatus), _defineProperty(_handleActions, FETCH_LESSON_PART_SUCCESS, setStatus), _defineProperty(_handleActions, FETCH_LESSON_PART_FAILURE, setStatus), _defineProperty(_handleActions, FETCH_FULL_LESSON, setStatus), _defineProperty(_handleActions, FETCH_FULL_LESSON_SUCCESS, setStatus), _defineProperty(_handleActions, FETCH_FULL_LESSON_FAILURE, setStatus), _defineProperty(_handleActions, SET_PAGE, onSetPage), _handleActions), initialState);

/* Selectors */

var getTotal = function getTotal(state) {
  return state.total;
};
var getItems = function getItems(state) {
  return state.items;
};
var getPageNo = function getPageNo(state) {
  return state.pageNo;
};
var getWip = function getWip(state) {
  return state.wip;
};
var getErrors = function getErrors(state) {
  return state.errors;
};

var selectors = exports.selectors = {
  getTotal: getTotal,
  getItems: getItems,
  getPageNo: getPageNo,
  getWip: getWip,
  getErrors: getErrors
};