'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sagas = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _effects = require('redux-saga/effects');

var _Api = require('../helpers/Api');

var _Api2 = _interopRequireDefault(_Api);

var _consts = require('../helpers/consts');

var _url = require('./helpers/url');

var _utils = require('../helpers/utils');

var _settings = require('../redux/modules/settings');

var _programs = require('../redux/modules/programs');

var _mdb = require('../redux/modules/mdb');

var _filters = require('../redux/modules/filters');

var _filters2 = require('../filters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(fetchGenres),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(fetchRecentlyUpdated),
    _marked3 = /*#__PURE__*/_regenerator2.default.mark(fetchList),
    _marked4 = /*#__PURE__*/_regenerator2.default.mark(fetchProgramsList),
    _marked5 = /*#__PURE__*/_regenerator2.default.mark(fetchFullProgramList),
    _marked6 = /*#__PURE__*/_regenerator2.default.mark(fetchProgramChapter),
    _marked7 = /*#__PURE__*/_regenerator2.default.mark(fetchFullProgram),
    _marked8 = /*#__PURE__*/_regenerator2.default.mark(updatePageInQuery),
    _marked9 = /*#__PURE__*/_regenerator2.default.mark(watchFetchList),
    _marked10 = /*#__PURE__*/_regenerator2.default.mark(watchFetchProgramChapter),
    _marked11 = /*#__PURE__*/_regenerator2.default.mark(watchFetchFullProgram),
    _marked12 = /*#__PURE__*/_regenerator2.default.mark(watchFetchFullProgramList),
    _marked13 = /*#__PURE__*/_regenerator2.default.mark(watchSetPage);

function fetchGenres() {
  var language, _ref, data;

  return _regenerator2.default.wrap(function fetchGenres$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.select)(function (state) {
            return _settings.selectors.getLanguage(state.settings);
          });

        case 2:
          language = _context.sent;
          _context.next = 5;
          return (0, _effects.call)(_Api2.default.collections, {
            language: language,
            content_type: _consts.CT_VIDEO_PROGRAM,
            pageNo: 1,
            pageSize: 1000,
            with_units: false
          });

        case 5:
          _ref = _context.sent;
          data = _ref.data;

          if (!Array.isArray(data.collections)) {
            _context.next = 12;
            break;
          }

          _context.next = 10;
          return (0, _effects.put)(_mdb.actions.receiveCollections(data.collections));

        case 10:
          _context.next = 12;
          return (0, _effects.put)(_programs.actions.receiveCollections(data.collections));

        case 12:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

function fetchRecentlyUpdated() {
  var _ref2, data;

  return _regenerator2.default.wrap(function fetchRecentlyUpdated$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.call)(_Api2.default.recentlyUpdated);

        case 2:
          _ref2 = _context2.sent;
          data = _ref2.data;

          if (!Array.isArray(data)) {
            _context2.next = 7;
            break;
          }

          _context2.next = 7;
          return (0, _effects.put)(_programs.actions.receiveRecentlyUpdated(data));

        case 7:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this);
}

function fetchList(action, filterName, successAction, failureAction) {
  var filters, params, language, args, _ref3, data;

  return _regenerator2.default.wrap(function fetchList$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _effects.select)(function (state) {
            return _filters.selectors.getFilters(state.filters, filterName);
          });

        case 2:
          filters = _context3.sent;
          params = _filters2.filtersTransformer.toApiParams(filters);
          _context3.prev = 4;
          _context3.next = 7;
          return (0, _effects.select)(function (state) {
            return _settings.selectors.getLanguage(state.settings);
          });

        case 7:
          language = _context3.sent;
          args = (0, _utils.isEmpty)(params) ? Object.assign({}, action.payload, { language: language, content_type: _consts.CT_VIDEO_PROGRAM_CHAPTER }) : Object.assign({}, action.payload, { language: language }, params, { content_type: _consts.CT_VIDEO_PROGRAM_CHAPTER });
          _context3.next = 11;
          return (0, _effects.call)(_Api2.default.units, args);

        case 11:
          _ref3 = _context3.sent;
          data = _ref3.data;

          if (action.payload.program) {
            data.program = action.payload.program;
          }

          if (!Array.isArray(data.collections)) {
            _context3.next = 17;
            break;
          }

          _context3.next = 17;
          return (0, _effects.put)(_mdb.actions.receiveCollections(data.collections));

        case 17:
          if (!Array.isArray(data.content_units)) {
            _context3.next = 20;
            break;
          }

          _context3.next = 20;
          return (0, _effects.put)(_mdb.actions.receiveContentUnits(data.content_units));

        case 20:
          _context3.next = 22;
          return (0, _effects.put)(successAction(data));

        case 22:
          _context3.next = 28;
          break;

        case 24:
          _context3.prev = 24;
          _context3.t0 = _context3['catch'](4);
          _context3.next = 28;
          return (0, _effects.put)(failureAction(_context3.t0));

        case 28:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3, this, [[4, 24]]);
}

function fetchProgramsList(action) {
  var genresTree, recentlyUpdated;
  return _regenerator2.default.wrap(function fetchProgramsList$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _effects.select)(function (state) {
            return _programs.selectors.getGenres(state.programs);
          });

        case 2:
          genresTree = _context4.sent;

          if (!(0, _utils.isEmpty)(genresTree)) {
            _context4.next = 6;
            break;
          }

          _context4.next = 6;
          return (0, _effects.fork)(fetchGenres);

        case 6:
          _context4.next = 8;
          return (0, _effects.select)(function (state) {
            return _programs.selectors.getRecentlyUpdated(state.programs);
          });

        case 8:
          recentlyUpdated = _context4.sent;

          if (!(0, _utils.isEmpty)(recentlyUpdated)) {
            _context4.next = 12;
            break;
          }

          _context4.next = 12;
          return (0, _effects.fork)(fetchRecentlyUpdated);

        case 12:
          _context4.next = 14;
          return fetchList(action, 'programs', _programs.actions.fetchListSuccess, _programs.actions.fetchListFailure);

        case 14:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked4, this);
}

function fetchFullProgramList(action) {
  return _regenerator2.default.wrap(function fetchFullProgramList$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return fetchList(action, 'full-program', _programs.actions.fetchFullProgramListSuccess, _programs.actions.fetchFullProgramListFailure);

        case 2:
        case 'end':
          return _context5.stop();
      }
    }
  }, _marked5, this);
}

function fetchProgramChapter(action) {
  var language, _ref4, data;

  return _regenerator2.default.wrap(function fetchProgramChapter$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return (0, _effects.select)(function (state) {
            return _settings.selectors.getLanguage(state.settings);
          });

        case 3:
          language = _context6.sent;
          _context6.next = 6;
          return (0, _effects.call)(_Api2.default.unit, { id: action.payload, language: language });

        case 6:
          _ref4 = _context6.sent;
          data = _ref4.data;
          _context6.next = 10;
          return (0, _effects.put)(_mdb.actions.receiveContentUnits([data]));

        case 10:
          _context6.next = 12;
          return (0, _effects.put)(_programs.actions.fetchProgramChapterSuccess(action.payload));

        case 12:
          _context6.next = 18;
          break;

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6['catch'](0);
          _context6.next = 18;
          return (0, _effects.put)(_programs.actions.fetchProgramChapterFailure(action.payload, _context6.t0));

        case 18:
        case 'end':
          return _context6.stop();
      }
    }
  }, _marked6, this, [[0, 14]]);
}

function fetchFullProgram(action) {
  var language, _ref5, data;

  return _regenerator2.default.wrap(function fetchFullProgram$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return (0, _effects.select)(function (state) {
            return _settings.selectors.getLanguage(state.settings);
          });

        case 3:
          language = _context7.sent;
          _context7.next = 6;
          return (0, _effects.call)(_Api2.default.collection, { id: action.payload, language: language });

        case 6:
          _ref5 = _context7.sent;
          data = _ref5.data;
          _context7.next = 10;
          return (0, _effects.put)(_mdb.actions.receiveCollections([data]));

        case 10:
          _context7.next = 12;
          return (0, _effects.put)(_programs.actions.fetchFullProgramSuccess(action.payload));

        case 12:
          _context7.next = 18;
          break;

        case 14:
          _context7.prev = 14;
          _context7.t0 = _context7['catch'](0);
          _context7.next = 18;
          return (0, _effects.put)(_programs.actions.fetchFullProgramFailure(action.payload, _context7.t0));

        case 18:
        case 'end':
          return _context7.stop();
      }
    }
  }, _marked7, this, [[0, 14]]);
}

function updatePageInQuery(action) {
  var page;
  return _regenerator2.default.wrap(function updatePageInQuery$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          page = action.payload > 1 ? action.payload : null;
          return _context8.delegateYield((0, _url.updateQuery)(function (query) {
            return Object.assign(query, { page: page });
          }), 't0', 2);

        case 2:
        case 'end':
          return _context8.stop();
      }
    }
  }, _marked8, this);
}

function watchFetchList() {
  return _regenerator2.default.wrap(function watchFetchList$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return (0, _effects.takeLatest)(_programs.types.FETCH_LIST, fetchProgramsList);

        case 2:
        case 'end':
          return _context9.stop();
      }
    }
  }, _marked9, this);
}

function watchFetchProgramChapter() {
  return _regenerator2.default.wrap(function watchFetchProgramChapter$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return (0, _effects.takeEvery)(_programs.types.FETCH_PROGRAM_CHAPTER, fetchProgramChapter);

        case 2:
        case 'end':
          return _context10.stop();
      }
    }
  }, _marked10, this);
}

function watchFetchFullProgram() {
  return _regenerator2.default.wrap(function watchFetchFullProgram$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return (0, _effects.takeLatest)(_programs.types.FETCH_FULL_PROGRAM, fetchFullProgram);

        case 2:
        case 'end':
          return _context11.stop();
      }
    }
  }, _marked11, this);
}

function watchFetchFullProgramList() {
  return _regenerator2.default.wrap(function watchFetchFullProgramList$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return (0, _effects.takeEvery)(_programs.types.FETCH_FULL_PROGRAM_LIST, fetchFullProgramList);

        case 2:
        case 'end':
          return _context12.stop();
      }
    }
  }, _marked12, this);
}

function watchSetPage() {
  return _regenerator2.default.wrap(function watchSetPage$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return (0, _effects.takeLatest)([_programs.types.SET_PAGE, _programs.types.SET_FULL_PROGRAM_PAGE], updatePageInQuery);

        case 2:
        case 'end':
          return _context13.stop();
      }
    }
  }, _marked13, this);
}

var sagas = exports.sagas = [watchFetchList, watchFetchProgramChapter, watchFetchFullProgram, watchFetchFullProgramList, watchSetPage];