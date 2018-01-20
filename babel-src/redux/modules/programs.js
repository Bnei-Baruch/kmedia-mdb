'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectors = exports.reducer = exports.actions = exports.types = undefined;

var _handleActions;

var _reduxActions = require('redux-actions');

var _settings = require('./settings');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* Types */

var SET_PAGE = 'Programs/SET_PAGE';
var SET_FULL_PROGRAM_PAGE = 'Programs/SET_FULL_PROGRAM_PAGE';

var FETCH_LIST = 'Programs/FETCH_LIST';
var FETCH_LIST_SUCCESS = 'Programs/FETCH_LIST_SUCCESS';
var FETCH_LIST_FAILURE = 'Programs/FETCH_LIST_FAILURE';
var FETCH_PROGRAM_CHAPTER = 'Program/FETCH_PROGRAM_CHAPTER';
var FETCH_PROGRAM_CHAPTER_SUCCESS = 'Program/FETCH_PROGRAM_CHAPTER_SUCCESS';
var FETCH_PROGRAM_CHAPTER_FAILURE = 'Program/FETCH_PROGRAM_CHAPTER_FAILURE';
var FETCH_FULL_PROGRAM = 'Program/FETCH_FULL_PROGRAM';
var FETCH_FULL_PROGRAM_SUCCESS = 'Program/FETCH_FULL_PROGRAM_SUCCESS';
var FETCH_FULL_PROGRAM_FAILURE = 'Program/FETCH_FULL_PROGRAM_FAILURE';
var FETCH_FULL_PROGRAM_LIST = 'Program/FETCH_FULL_PROGRAM_LIST';
var FETCH_FULL_PROGRAM_LIST_SUCCESS = 'Program/FETCH_FULL_PROGRAM_LIST_SUCCESS';
var FETCH_FULL_PROGRAM_LIST_FAILURE = 'Program/FETCH_FULL_PROGRAM_LIST_FAILURE';
var RECEIVE_COLLECTIONS = 'Programs/RECEIVE_COLLECTIONS';
var RECEIVE_RECENTLY_UPDATED = 'Programs/RECEIVE_RECENTLY_UPDATED';

var types = exports.types = {
  SET_PAGE: SET_PAGE,
  SET_FULL_PROGRAM_PAGE: SET_FULL_PROGRAM_PAGE,
  FETCH_LIST: FETCH_LIST,
  FETCH_LIST_SUCCESS: FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE: FETCH_LIST_FAILURE,
  FETCH_PROGRAM_CHAPTER: FETCH_PROGRAM_CHAPTER,
  FETCH_PROGRAM_CHAPTER_SUCCESS: FETCH_PROGRAM_CHAPTER_SUCCESS,
  FETCH_PROGRAM_CHAPTER_FAILURE: FETCH_PROGRAM_CHAPTER_FAILURE,
  FETCH_FULL_PROGRAM: FETCH_FULL_PROGRAM,
  FETCH_FULL_PROGRAM_SUCCESS: FETCH_FULL_PROGRAM_SUCCESS,
  FETCH_FULL_PROGRAM_FAILURE: FETCH_FULL_PROGRAM_FAILURE,
  FETCH_FULL_PROGRAM_LIST: FETCH_FULL_PROGRAM_LIST,
  FETCH_FULL_PROGRAM_LIST_SUCCESS: FETCH_FULL_PROGRAM_LIST_SUCCESS,
  FETCH_FULL_PROGRAM_LIST_FAILURE: FETCH_FULL_PROGRAM_LIST_FAILURE,
  RECEIVE_COLLECTIONS: RECEIVE_COLLECTIONS,
  RECEIVE_RECENTLY_UPDATED: RECEIVE_RECENTLY_UPDATED
};

/* Actions */

var setPage = (0, _reduxActions.createAction)(SET_PAGE);
var setFullProgramPage = (0, _reduxActions.createAction)(SET_FULL_PROGRAM_PAGE);
var fetchList = (0, _reduxActions.createAction)(FETCH_LIST, function (_ref) {
  var pageNo = _ref.pageNo,
      language = _ref.language,
      pageSize = _ref.pageSize;
  return {
    pageNo: pageNo,
    language: language,
    pageSize: pageSize
  };
});
var fetchListSuccess = (0, _reduxActions.createAction)(FETCH_LIST_SUCCESS);
var fetchListFailure = (0, _reduxActions.createAction)(FETCH_LIST_FAILURE);
var fetchProgramChapter = (0, _reduxActions.createAction)(FETCH_PROGRAM_CHAPTER);
var fetchProgramChapterSuccess = (0, _reduxActions.createAction)(FETCH_PROGRAM_CHAPTER_SUCCESS);
var fetchProgramChapterFailure = (0, _reduxActions.createAction)(FETCH_PROGRAM_CHAPTER_FAILURE, function (id, err) {
  return { id: id, err: err };
});
var fetchFullProgram = (0, _reduxActions.createAction)(FETCH_FULL_PROGRAM);
var fetchFullProgramSuccess = (0, _reduxActions.createAction)(FETCH_FULL_PROGRAM_SUCCESS);
var fetchFullProgramFailure = (0, _reduxActions.createAction)(FETCH_FULL_PROGRAM_FAILURE, function (id, err) {
  return { id: id, err: err };
});
var fetchFullProgramList = (0, _reduxActions.createAction)(FETCH_FULL_PROGRAM_LIST, function (pageNo, pageSize, language, id) {
  return {
    pageNo: pageNo,
    pageSize: pageSize,
    language: language,
    program: id
  };
});
var fetchFullProgramListSuccess = (0, _reduxActions.createAction)(FETCH_FULL_PROGRAM_LIST_SUCCESS);
var fetchFullProgramListFailure = (0, _reduxActions.createAction)(FETCH_FULL_PROGRAM_LIST_FAILURE);
var receiveCollections = (0, _reduxActions.createAction)(RECEIVE_COLLECTIONS);
var receiveRecentlyUpdated = (0, _reduxActions.createAction)(RECEIVE_RECENTLY_UPDATED);

var actions = exports.actions = {
  setPage: setPage,
  setFullProgramPage: setFullProgramPage,
  fetchList: fetchList,
  fetchListSuccess: fetchListSuccess,
  fetchListFailure: fetchListFailure,
  fetchProgramChapter: fetchProgramChapter,
  fetchProgramChapterSuccess: fetchProgramChapterSuccess,
  fetchProgramChapterFailure: fetchProgramChapterFailure,
  fetchFullProgram: fetchFullProgram,
  fetchFullProgramSuccess: fetchFullProgramSuccess,
  fetchFullProgramFailure: fetchFullProgramFailure,
  fetchFullProgramList: fetchFullProgramList,
  fetchFullProgramListSuccess: fetchFullProgramListSuccess,
  fetchFullProgramListFailure: fetchFullProgramListFailure,
  receiveCollections: receiveCollections,
  receiveRecentlyUpdated: receiveRecentlyUpdated
};

/* Reducer */

var initialState = {
  total: 0,
  pageNo: 1,
  items: [],
  fullPaging: {
    total: 0,
    pageNo: 1,
    items: []
  },
  genres: [],
  programs: [],
  recentlyUpdated: [],
  wip: {
    list: false,
    fullList: false,
    chapters: {},
    fulls: {}
  },
  errors: {
    list: null,
    fullList: null,
    chapters: {},
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
    case FETCH_PROGRAM_CHAPTER:
      wip.chapters = Object.assign({}, wip.chapters, _defineProperty({}, action.payload, true));
      break;
    case FETCH_FULL_PROGRAM:
      wip.fulls = Object.assign({}, wip.fulls, _defineProperty({}, action.payload, true));
      break;
    case FETCH_FULL_PROGRAM_LIST:
      wip.fullList = true;
      break;
    case FETCH_LIST_SUCCESS:
      wip.list = false;
      errors.list = null;
      break;
    case FETCH_PROGRAM_CHAPTER_SUCCESS:
      wip.chapters = Object.assign({}, wip.chapters, _defineProperty({}, action.payload, false));
      errors.chapters = Object.assign({}, errors.chapters, _defineProperty({}, action.payload, null));
      break;
    case FETCH_FULL_PROGRAM_SUCCESS:
      wip.fulls = Object.assign({}, wip.fulls, _defineProperty({}, action.payload, false));
      errors.fulls = Object.assign({}, errors.fulls, _defineProperty({}, action.payload, null));
      break;
    case FETCH_FULL_PROGRAM_LIST_SUCCESS:
      wip.fullList = false;
      errors.fullList = null;
      break;
    case FETCH_LIST_FAILURE:
      wip.list = false;
      errors.list = action.payload;
      break;
    case FETCH_PROGRAM_CHAPTER_FAILURE:
      wip.chapters = Object.assign({}, wip.chapters, _defineProperty({}, action.payload.id, false));
      errors.chapters = Object.assign({}, errors.chapters, _defineProperty({}, action.payload.id, action.payload.err));
      break;
    case FETCH_FULL_PROGRAM_FAILURE:
      wip.fulls = Object.assign({}, wip.fulls, _defineProperty({}, action.payload.id, false));
      errors.fulls = Object.assign({}, errors.fulls, _defineProperty({}, action.payload.id, action.payload.err));
      break;
    case FETCH_FULL_PROGRAM_LIST_FAILURE:
      wip.fullList = false;
      errors.fullList = action.payload;
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
  return Object.assign({}, state, {
    total: action.payload.total,
    items: items.map(function (x) {
      return x.id;
    })
  });
};

var onFetchFullProgramListSuccess = function onFetchFullProgramListSuccess(state, action) {
  var items = action.payload.collections || action.payload.content_units || [];
  return Object.assign({}, state, {
    fullPaging: Object.assign({}, state.fullPaging, {
      total: action.payload.total,
      items: items.map(function (x) {
        return x.id;
      })
    })
  });
};

var onSetPage = function onSetPage(state, action) {
  return Object.assign({}, state, {
    pageNo: action.payload
  });
};

var onSetFullProgramPage = function onSetFullProgramPage(state, action) {
  return Object.assign({}, state, {
    fullPaging: Object.assign({}, state.fullPaging, {
      pageNo: action.payload
    })
  });
};

var onSetLanguage = function onSetLanguage(state) {
  return Object.assign({}, state, {
    items: [],
    fullPaging: Object.assign({}, state.fullPaging, {
      items: []
    }),
    genres: [],
    programs: []
  });
};

var onReceiveCollections = function onReceiveCollections(state, action) {
  var genres = [].concat(_toConsumableArray(new Set(action.payload.map(function (x) {
    return x.genres;
  }).reduce(function (acc, cur) {
    return acc.concat(cur);
  }, [])))).sort();

  return Object.assign({}, state, {
    genres: genres,
    programs: action.payload
  });
};

var onReceiveRecentlyUpdated = function onReceiveRecentlyUpdated(state, action) {
  return Object.assign({}, state, {
    recentlyUpdated: action.payload
  });
};

var reducer = exports.reducer = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, _settings.types.SET_LANGUAGE, onSetLanguage), _defineProperty(_handleActions, FETCH_LIST, setStatus), _defineProperty(_handleActions, FETCH_LIST_SUCCESS, function (state, action) {
  return setStatus(onFetchListSuccess(state, action), action);
}), _defineProperty(_handleActions, FETCH_LIST_FAILURE, setStatus), _defineProperty(_handleActions, FETCH_PROGRAM_CHAPTER, setStatus), _defineProperty(_handleActions, FETCH_PROGRAM_CHAPTER_SUCCESS, setStatus), _defineProperty(_handleActions, FETCH_PROGRAM_CHAPTER_FAILURE, setStatus), _defineProperty(_handleActions, FETCH_FULL_PROGRAM, setStatus), _defineProperty(_handleActions, FETCH_FULL_PROGRAM_SUCCESS, setStatus), _defineProperty(_handleActions, FETCH_FULL_PROGRAM_FAILURE, setStatus), _defineProperty(_handleActions, FETCH_FULL_PROGRAM_LIST, setStatus), _defineProperty(_handleActions, FETCH_FULL_PROGRAM_LIST_SUCCESS, function (state, action) {
  return setStatus(onFetchFullProgramListSuccess(state, action), action);
}), _defineProperty(_handleActions, FETCH_FULL_PROGRAM_LIST_FAILURE, setStatus), _defineProperty(_handleActions, SET_PAGE, onSetPage), _defineProperty(_handleActions, SET_FULL_PROGRAM_PAGE, onSetFullProgramPage), _defineProperty(_handleActions, RECEIVE_COLLECTIONS, onReceiveCollections), _defineProperty(_handleActions, RECEIVE_RECENTLY_UPDATED, onReceiveRecentlyUpdated), _handleActions), initialState);

/* Selectors */

var getTotal = function getTotal(state) {
  return state.total;
};
var getPageNo = function getPageNo(state) {
  return state.pageNo;
};
var getItems = function getItems(state) {
  return state.items;
};
var getFullPaging = function getFullPaging(state) {
  return state.fullPaging;
};
var getWip = function getWip(state) {
  return state.wip;
};
var getErrors = function getErrors(state) {
  return state.errors;
};
var getGenres = function getGenres(state) {
  return state.genres;
};
var getPrograms = function getPrograms(state) {
  return state.programs;
};
var getRecentlyUpdated = function getRecentlyUpdated(state) {
  return state.recentlyUpdated;
};

var selectors = exports.selectors = {
  getTotal: getTotal,
  getItems: getItems,
  getFullPaging: getFullPaging,
  getPageNo: getPageNo,
  getWip: getWip,
  getErrors: getErrors,
  getGenres: getGenres,
  getPrograms: getPrograms,
  getRecentlyUpdated: getRecentlyUpdated
};