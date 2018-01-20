'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.getQuery = getQuery;
exports.updateQuery = updateQuery;

var _effects = require('redux-saga/effects');

var _reactRouterRedux = require('react-router-redux');

var _url = require('../../helpers/url');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(getQuery),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(updateQuery);

function getQuery() {
  var router;
  return _regenerator2.default.wrap(function getQuery$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.select)(function (state) {
            return state.router;
          });

        case 2:
          router = _context.sent;
          return _context.abrupt('return', (0, _url.parse)(router.location.search.slice(1)));

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

function updateQuery(updater) {
  var query;
  return _regenerator2.default.wrap(function updateQuery$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.delegateYield(getQuery(), 't0', 1);

        case 1:
          query = _context2.t0;
          _context2.next = 4;
          return (0, _effects.put)((0, _reactRouterRedux.replace)({ search: (0, _url.stringify)(updater(query)) }));

        case 4:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this);
}