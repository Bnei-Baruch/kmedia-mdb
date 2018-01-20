'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.rootSaga = rootSaga;

var _effects = require('redux-saga/effects');

var _lessons = require('./lessons');

var _programs = require('./programs');

var _events = require('./events');

var _sources = require('./sources');

var _filters = require('./filters');

var _tags = require('./tags');

var _settings = require('./settings');

var _search = require('./search');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(rootSaga);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var allSagas = [].concat(_toConsumableArray(_lessons.sagas), _toConsumableArray(_programs.sagas), _toConsumableArray(_events.sagas), _toConsumableArray(_sources.sagas), _toConsumableArray(_filters.sagas), _toConsumableArray(_tags.sagas), _toConsumableArray(_settings.sagas), _toConsumableArray(_search.sagas));

exports.default = allSagas;
function rootSaga() {
  return _regenerator2.default.wrap(function rootSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.all)(allSagas.map(function (s) {
            return s();
          }));

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}