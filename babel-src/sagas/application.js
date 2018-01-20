'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = application;

var _reduxSaga = require('redux-saga');

var _effects = require('redux-saga/effects');

var _system = require('../redux/modules/system');

var _sources = require('./sources');

var _tags = require('./tags');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(application);

//
// The main application
//
function application() {
  var sources, tags;
  return _regenerator2.default.wrap(function application$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.put)(_system.actions.boot());

        case 2:
          _context.next = 4;
          return (0, _effects.fork)(_sources.fetchSources);

        case 4:
          sources = _context.sent;
          _context.next = 7;
          return (0, _effects.fork)(_tags.fetchTags);

        case 7:
          tags = _context.sent;
          _context.next = 10;
          return (0, _effects.join)(sources, tags);

        case 10:
          _context.next = 12;
          return (0, _effects.put)(_system.actions.init({}));

        case 12:
          _context.next = 14;
          return (0, _reduxSaga.delay)(0);

        case 14:
          _context.next = 16;
          return (0, _effects.put)(_system.actions.ready());

        case 16:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}