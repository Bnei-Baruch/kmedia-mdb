'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sagas = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.fetchSources = fetchSources;

var _effects = require('redux-saga/effects');

var _Api = require('../helpers/Api');

var _Api2 = _interopRequireDefault(_Api);

var _sources = require('../redux/modules/sources');

var _system = require('../redux/modules/system');

var _settings = require('../redux/modules/settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(fetchSources),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(fetchIndex),
    _marked3 = /*#__PURE__*/_regenerator2.default.mark(fetchContent),
    _marked4 = /*#__PURE__*/_regenerator2.default.mark(watchFetchSources),
    _marked5 = /*#__PURE__*/_regenerator2.default.mark(watchFetchIndex),
    _marked6 = /*#__PURE__*/_regenerator2.default.mark(watchFetchContent);

function fetchSources() {
  var language, _ref, data;

  return _regenerator2.default.wrap(function fetchSources$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return (0, _effects.select)(function (state) {
            return _settings.selectors.getLanguage(state.settings);
          });

        case 3:
          language = _context.sent;
          _context.next = 6;
          return (0, _effects.call)(_Api2.default.sources, { language: language });

        case 6:
          _ref = _context.sent;
          data = _ref.data;
          _context.next = 10;
          return (0, _effects.put)(_sources.actions.fetchSourcesSuccess(data));

        case 10:
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context['catch'](0);
          _context.next = 16;
          return (0, _effects.put)(_sources.actions.fetchSourcesFailure(_context.t0));

        case 16:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this, [[0, 12]]);
}

function fetchIndex(action) {
  var id, _ref2, data;

  return _regenerator2.default.wrap(function fetchIndex$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = action.payload;
          _context2.prev = 1;
          _context2.next = 4;
          return (0, _effects.call)(_Api2.default.sourceIdx, { id: id });

        case 4:
          _ref2 = _context2.sent;
          data = _ref2.data;
          _context2.next = 8;
          return (0, _effects.put)(_sources.actions.fetchIndexSuccess(id, data));

        case 8:
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2['catch'](1);
          _context2.next = 14;
          return (0, _effects.put)(_sources.actions.fetchIndexFailure(id, _context2.t0));

        case 14:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this, [[1, 10]]);
}

function fetchContent(action) {
  var _ref3, data;

  return _regenerator2.default.wrap(function fetchContent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return (0, _effects.call)(_Api2.default.sourceContent, action.payload);

        case 3:
          _ref3 = _context3.sent;
          data = _ref3.data;
          _context3.next = 7;
          return (0, _effects.put)(_sources.actions.fetchContentSuccess(data));

        case 7:
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3['catch'](0);
          _context3.next = 13;
          return (0, _effects.put)(_sources.actions.fetchContentFailure(_context3.t0));

        case 13:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3, this, [[0, 9]]);
}

function watchFetchSources() {
  return _regenerator2.default.wrap(function watchFetchSources$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _effects.takeLatest)(_sources.types.FETCH_SOURCES, fetchSources);

        case 2:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked4, this);
}

function watchFetchIndex() {
  return _regenerator2.default.wrap(function watchFetchIndex$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return (0, _effects.takeEvery)(_sources.types.FETCH_INDEX, fetchIndex);

        case 2:
        case 'end':
          return _context5.stop();
      }
    }
  }, _marked5, this);
}

function watchFetchContent() {
  return _regenerator2.default.wrap(function watchFetchContent$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return (0, _effects.takeLatest)(_sources.types.FETCH_CONTENT, fetchContent);

        case 2:
        case 'end':
          return _context6.stop();
      }
    }
  }, _marked6, this);
}

var sagas = exports.sagas = [watchFetchSources, watchFetchIndex, watchFetchContent];