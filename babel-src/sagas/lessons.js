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

var _url = require('./helpers/url');

var _settings = require('../redux/modules/settings');

var _lessons = require('../redux/modules/lessons');

var _mdb = require('../redux/modules/mdb');

var _filters = require('../redux/modules/filters');

var _filters2 = require('../filters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(fetchList),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(updatePageInQuery),
    _marked3 = /*#__PURE__*/_regenerator2.default.mark(fetchLessonPart),
    _marked4 = /*#__PURE__*/_regenerator2.default.mark(fetchFullLesson),
    _marked5 = /*#__PURE__*/_regenerator2.default.mark(watchFetchList),
    _marked6 = /*#__PURE__*/_regenerator2.default.mark(watchFetchLessonPart),
    _marked7 = /*#__PURE__*/_regenerator2.default.mark(watchFetchFullLesson),
    _marked8 = /*#__PURE__*/_regenerator2.default.mark(watchSetPage);

function fetchList(action) {
  var filters, params, _ref, data, cuIDsToFetch, language, pageSize, resp;

  return _regenerator2.default.wrap(function fetchList$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.select)(function (state) {
            return _filters.selectors.getFilters(state.filters, 'lessons');
          });

        case 2:
          filters = _context.sent;
          params = _filters2.filtersTransformer.toApiParams(filters);
          _context.prev = 4;
          _context.next = 7;
          return (0, _effects.call)(_Api2.default.lessons, Object.assign({}, action.payload, params));

        case 7:
          _ref = _context.sent;
          data = _ref.data;

          if (!Array.isArray(data.collections)) {
            _context.next = 22;
            break;
          }

          _context.next = 12;
          return (0, _effects.put)(_mdb.actions.receiveCollections(data.collections));

        case 12:

          // TODO edo: optimize data fetching
          // Here comes another call for all content_units we got
          // in order to fetch their possible additional collections.
          // We need this to show 'related to' second line in list.
          // This second round trip to the API is awful,
          // we should strive for a single call to the API and get all the data we need.
          // hmm, relay..., hmm ?
          cuIDsToFetch = data.collections.reduce(function (acc, val) {
            if (Array.isArray(val.content_units)) {
              return acc.concat(val.content_units.map(function (x) {
                return x.id;
              }));
            }
            return acc;
          }, []);
          _context.next = 15;
          return (0, _effects.select)(function (state) {
            return _settings.selectors.getLanguage(state.settings);
          });

        case 15:
          language = _context.sent;
          pageSize = cuIDsToFetch.length;
          _context.next = 19;
          return (0, _effects.call)(_Api2.default.units, { id: cuIDsToFetch, pageSize: pageSize, language: language });

        case 19:
          resp = _context.sent;
          _context.next = 22;
          return (0, _effects.put)(_mdb.actions.receiveContentUnits(resp.data.content_units));

        case 22:
          if (!Array.isArray(data.content_units)) {
            _context.next = 25;
            break;
          }

          _context.next = 25;
          return (0, _effects.put)(_mdb.actions.receiveContentUnits(data.content_units));

        case 25:
          _context.next = 27;
          return (0, _effects.put)(_lessons.actions.fetchListSuccess(data));

        case 27:
          _context.next = 33;
          break;

        case 29:
          _context.prev = 29;
          _context.t0 = _context['catch'](4);
          _context.next = 33;
          return (0, _effects.put)(_lessons.actions.fetchListFailure(_context.t0));

        case 33:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this, [[4, 29]]);
}

function updatePageInQuery(action) {
  var page;
  return _regenerator2.default.wrap(function updatePageInQuery$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          page = action.payload > 1 ? action.payload : null;
          return _context2.delegateYield((0, _url.updateQuery)(function (query) {
            return Object.assign(query, { page: page });
          }), 't0', 2);

        case 2:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this);
}

function fetchLessonPart(action) {
  var language, _ref2, data;

  return _regenerator2.default.wrap(function fetchLessonPart$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return (0, _effects.select)(function (state) {
            return _settings.selectors.getLanguage(state.settings);
          });

        case 3:
          language = _context3.sent;
          _context3.next = 6;
          return (0, _effects.call)(_Api2.default.unit, { id: action.payload, language: language });

        case 6:
          _ref2 = _context3.sent;
          data = _ref2.data;
          _context3.next = 10;
          return (0, _effects.put)(_mdb.actions.receiveContentUnits([data]));

        case 10:
          _context3.next = 12;
          return (0, _effects.put)(_lessons.actions.fetchLessonPartSuccess(action.payload));

        case 12:
          action.deferred.resolve();
          _context3.next = 20;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3['catch'](0);
          _context3.next = 19;
          return (0, _effects.put)(_lessons.actions.fetchLessonPartFailure(action.payload, _context3.t0));

        case 19:
          action.deferred.reject();

        case 20:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3, this, [[0, 15]]);
}

function fetchFullLesson(action) {
  var language, _ref3, data;

  return _regenerator2.default.wrap(function fetchFullLesson$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return (0, _effects.select)(function (state) {
            return _settings.selectors.getLanguage(state.settings);
          });

        case 3:
          language = _context4.sent;
          _context4.next = 6;
          return (0, _effects.call)(_Api2.default.collection, { id: action.payload, language: language });

        case 6:
          _ref3 = _context4.sent;
          data = _ref3.data;
          _context4.next = 10;
          return (0, _effects.put)(_mdb.actions.receiveCollections([data]));

        case 10:
          _context4.next = 12;
          return (0, _effects.put)(_lessons.actions.fetchFullLessonSuccess(action.payload));

        case 12:
          _context4.next = 18;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4['catch'](0);
          _context4.next = 18;
          return (0, _effects.put)(_lessons.actions.fetchFullLessonFailure(action.payload, _context4.t0));

        case 18:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked4, this, [[0, 14]]);
}

function watchFetchList() {
  return _regenerator2.default.wrap(function watchFetchList$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return (0, _effects.takeLatest)(_lessons.types.FETCH_LIST, fetchList);

        case 2:
        case 'end':
          return _context5.stop();
      }
    }
  }, _marked5, this);
}

function watchFetchLessonPart() {
  return _regenerator2.default.wrap(function watchFetchLessonPart$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return (0, _effects.takeEvery)(_lessons.types.FETCH_LESSON_PART, fetchLessonPart);

        case 2:
        case 'end':
          return _context6.stop();
      }
    }
  }, _marked6, this);
}

function watchFetchFullLesson() {
  return _regenerator2.default.wrap(function watchFetchFullLesson$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return (0, _effects.takeEvery)(_lessons.types.FETCH_FULL_LESSON, fetchFullLesson);

        case 2:
        case 'end':
          return _context7.stop();
      }
    }
  }, _marked7, this);
}

function watchSetPage() {
  return _regenerator2.default.wrap(function watchSetPage$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return (0, _effects.takeLatest)(_lessons.types.SET_PAGE, updatePageInQuery);

        case 2:
        case 'end':
          return _context8.stop();
      }
    }
  }, _marked8, this);
}

var sagas = exports.sagas = [watchFetchList, watchFetchLessonPart, watchSetPage, watchFetchFullLesson];