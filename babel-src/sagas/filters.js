'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sagas = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _effects = require('redux-saga/effects');

var _url = require('./helpers/url');

var _filters = require('../redux/modules/filters');

var _filters2 = require('../filters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(updateFilterValuesInQuery),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(hydrateFilters),
    _marked3 = /*#__PURE__*/_regenerator2.default.mark(watchFilterValueChange),
    _marked4 = /*#__PURE__*/_regenerator2.default.mark(watchHydrateFilters);

/*
 * When a filter value is changed, the query is also changed to match..
 * The params in the query can have the filter's name and value transformed
 * (to for example a different string representation)
 *
 * The filters values can be hydrated (by dispatching HYDRATE_FILTERS)
 * from a query containing keys and values matching filters that know how to transform them.
 * The hydration is needed when we mount a page containing filters and we have a query full of filter values
 * (this enables us to link to specific results).
 * You can know that filter values have been hydrated when the FILTERS_HYDRATED action is dispatched.
 *
 * The sagas will catch actions that change filter values and update the query accordingly.
 * NOTE: if you add new actions you'll need to watch for those too.
 */

function updateFilterValuesInQuery(action) {
  var filters;
  return _regenerator2.default.wrap(function updateFilterValuesInQuery$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.select)(function (state) {
            return _filters.selectors.getFilters(state.filters, action.payload.namespace);
          });

        case 2:
          filters = _context.sent;
          return _context.delegateYield((0, _url.updateQuery)(function (query) {
            return Object.assign(query, _filters2.filtersTransformer.toQueryParams(filters));
          }), 't0', 4);

        case 4:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

function hydrateFilters(action) {
  var query, filters;
  return _regenerator2.default.wrap(function hydrateFilters$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.delegateYield((0, _url.getQuery)(), 't0', 1);

        case 1:
          query = _context2.t0;
          filters = _filters2.filtersTransformer.fromQueryParams(query);
          _context2.next = 5;
          return (0, _effects.put)(_filters.actions.setHydratedFilterValues(action.payload.namespace, filters));

        case 5:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this);
}

var valueChangingActions = [_filters.types.ADD_FILTER_VALUE, _filters.types.SET_FILTER_VALUE, _filters.types.REMOVE_FILTER_VALUE];

function watchFilterValueChange() {
  return _regenerator2.default.wrap(function watchFilterValueChange$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _effects.takeEvery)(valueChangingActions, updateFilterValuesInQuery);

        case 2:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3, this);
}

function watchHydrateFilters() {
  return _regenerator2.default.wrap(function watchHydrateFilters$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _effects.takeEvery)(_filters.types.HYDRATE_FILTERS, hydrateFilters);

        case 2:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked4, this);
}

var sagas = exports.sagas = [watchFilterValueChange, watchHydrateFilters];