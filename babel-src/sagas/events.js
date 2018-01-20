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

var _settings = require('../redux/modules/settings');

var _events = require('../redux/modules/events');

var _mdb = require('../redux/modules/mdb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(fetchAllEvents),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(fetchEventItem),
    _marked3 = /*#__PURE__*/_regenerator2.default.mark(fetchFullEvent),
    _marked4 = /*#__PURE__*/_regenerator2.default.mark(watchFetchAllEvents),
    _marked5 = /*#__PURE__*/_regenerator2.default.mark(watchFetchEventItem),
    _marked6 = /*#__PURE__*/_regenerator2.default.mark(watchFetchFullEvent);

function fetchAllEvents(action) {
  var language, _ref, data;

  return _regenerator2.default.wrap(function fetchAllEvents$(_context) {
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
          return (0, _effects.call)(_Api2.default.collections, Object.assign({}, action.payload, {
            contentTypes: _consts.EVENT_TYPES,
            language: language,
            pageNo: 1,
            pageSize: 1000, // NOTE: we need to get all events, and the endpoint lets us fetch only with pagination,
            with_units: false
          }));

        case 6:
          _ref = _context.sent;
          data = _ref.data;
          _context.next = 10;
          return (0, _effects.put)(_mdb.actions.receiveCollections(data.collections));

        case 10:
          _context.next = 12;
          return (0, _effects.put)(_events.actions.fetchAllEventsSuccess(data));

        case 12:
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context['catch'](0);
          _context.next = 18;
          return (0, _effects.put)(_events.actions.fetchAllEventsFailure(_context.t0));

        case 18:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this, [[0, 14]]);
}

function fetchEventItem(action) {
  var language, _ref2, data;

  return _regenerator2.default.wrap(function fetchEventItem$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return (0, _effects.select)(function (state) {
            return _settings.selectors.getLanguage(state.settings);
          });

        case 3:
          language = _context2.sent;
          _context2.next = 6;
          return (0, _effects.call)(_Api2.default.unit, { id: action.payload, language: language });

        case 6:
          _ref2 = _context2.sent;
          data = _ref2.data;
          _context2.next = 10;
          return (0, _effects.put)(_mdb.actions.receiveContentUnits([data]));

        case 10:
          _context2.next = 12;
          return (0, _effects.put)(_events.actions.fetchEventItemSuccess(action.payload));

        case 12:
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2['catch'](0);
          _context2.next = 18;
          return (0, _effects.put)(_events.actions.fetchEventItemFailure(action.payload, _context2.t0));

        case 18:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this, [[0, 14]]);
}

function fetchFullEvent(action) {
  var language, _ref3, data;

  return _regenerator2.default.wrap(function fetchFullEvent$(_context3) {
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
          return (0, _effects.call)(_Api2.default.collection, { id: action.payload, language: language });

        case 6:
          _ref3 = _context3.sent;
          data = _ref3.data;
          _context3.next = 10;
          return (0, _effects.put)(_mdb.actions.receiveCollections([data]));

        case 10:
          _context3.next = 12;
          return (0, _effects.put)(_events.actions.fetchFullEventSuccess(action.payload));

        case 12:
          _context3.next = 18;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3['catch'](0);
          _context3.next = 18;
          return (0, _effects.put)(_events.actions.fetchFullEventFailure(action.payload, _context3.t0));

        case 18:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3, this, [[0, 14]]);
}

function watchFetchAllEvents() {
  return _regenerator2.default.wrap(function watchFetchAllEvents$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _effects.takeLatest)(_events.types.FETCH_ALL_EVENTS, fetchAllEvents);

        case 2:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked4, this);
}

function watchFetchEventItem() {
  return _regenerator2.default.wrap(function watchFetchEventItem$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return (0, _effects.takeEvery)(_events.types.FETCH_EVENT_ITEM, fetchEventItem);

        case 2:
        case 'end':
          return _context5.stop();
      }
    }
  }, _marked5, this);
}

function watchFetchFullEvent() {
  return _regenerator2.default.wrap(function watchFetchFullEvent$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return (0, _effects.takeLatest)(_events.types.FETCH_FULL_EVENT, fetchFullEvent);

        case 2:
        case 'end':
          return _context6.stop();
      }
    }
  }, _marked6, this);
}

var sagas = exports.sagas = [watchFetchAllEvents, watchFetchEventItem, watchFetchFullEvent];