'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sagas = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _effects = require('redux-saga/effects');

var _Api = require('../helpers/Api');

var _Api2 = _interopRequireDefault(_Api);

var _url = require('./helpers/url');

var _search = require('../redux/modules/search');

var _settings = require('../redux/modules/settings');

var _mdb = require('../redux/modules/mdb');

var _filters = require('../redux/modules/filters');

var _filters2 = require('../filters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(autocomplete),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(search),
    _marked3 = /*#__PURE__*/_regenerator2.default.mark(updatePageInQuery),
    _marked4 = /*#__PURE__*/_regenerator2.default.mark(updateSortByInQuery),
    _marked5 = /*#__PURE__*/_regenerator2.default.mark(hydrateUrl),
    _marked6 = /*#__PURE__*/_regenerator2.default.mark(watchAutocomplete),
    _marked7 = /*#__PURE__*/_regenerator2.default.mark(watchSearch),
    _marked8 = /*#__PURE__*/_regenerator2.default.mark(watchSetPage),
    _marked9 = /*#__PURE__*/_regenerator2.default.mark(watchSetSortBy),
    _marked10 = /*#__PURE__*/_regenerator2.default.mark(watchHydrateUrl);

function autocomplete(action) {
  var language, _ref, data;

  return _regenerator2.default.wrap(function autocomplete$(_context) {
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
          return (0, _effects.call)(_Api2.default.autocomplete, { q: action.payload, language: language });

        case 6:
          _ref = _context.sent;
          data = _ref.data;
          _context.next = 10;
          return (0, _effects.put)(_search.actions.autocompleteSuccess(data));

        case 10:
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context['catch'](0);
          _context.next = 16;
          return (0, _effects.put)(_search.actions.autocompleteFailure(_context.t0));

        case 16:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this, [[0, 12]]);
}

function search(action) {
  var language, sortBy, filters, params, filterKeyValues, filterParams, q, _ref4, data, cuIDsToFetch, _language, pageSize, resp;

  return _regenerator2.default.wrap(function search$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          return _context2.delegateYield((0, _url.updateQuery)(function (query) {
            return Object.assign(query, { q: action.payload.q });
          }), 't0', 2);

        case 2:
          _context2.next = 4;
          return (0, _effects.select)(function (state) {
            return _settings.selectors.getLanguage(state.settings);
          });

        case 4:
          language = _context2.sent;
          _context2.next = 7;
          return (0, _effects.select)(function (state) {
            return _search.selectors.getSortBy(state.search);
          });

        case 7:
          sortBy = _context2.sent;
          _context2.next = 10;
          return (0, _effects.select)(function (state) {
            return _filters.selectors.getFilters(state.filters, 'search');
          });

        case 10:
          filters = _context2.sent;
          params = _filters2.filtersTransformer.toApiParams(filters);
          filterKeyValues = Object.entries(params).map(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
                v = _ref3[0],
                k = _ref3[1];

            return v + ':' + k;
          }).join(' ');
          filterParams = filterKeyValues ? ' ' + filterKeyValues : '';
          q = action.payload.q.trim() ? '' + action.payload.q.trim() + filterParams : filterParams;

          if (q) {
            _context2.next = 19;
            break;
          }

          _context2.next = 18;
          return (0, _effects.put)(_search.actions.searchFailure(null));

        case 18:
          return _context2.abrupt('return');

        case 19:
          _context2.next = 21;
          return (0, _effects.call)(_Api2.default.search, Object.assign({}, action.payload, { q: q, sortBy: sortBy, language: language }));

        case 21:
          _ref4 = _context2.sent;
          data = _ref4.data;

          if (!(Array.isArray(data.hits.hits) && data.hits.hits.length > 0)) {
            _context2.next = 34;
            break;
          }

          // TODO edo: optimize data fetching
          // Here comes another call for all content_units we got
          // in order to fetch their possible additional collections.
          // We need this to show 'related to' second line in list.
          // This second round trip to the API is awful,
          // we should strive for a single call to the API and get all the data we need.
          // hmm, relay..., hmm ?
          cuIDsToFetch = data.hits.hits.reduce(function (acc, val) {
            return acc.concat(val._source.mdb_uid);
          }, []);
          _context2.next = 27;
          return (0, _effects.select)(function (state) {
            return _settings.selectors.getLanguage(state.settings);
          });

        case 27:
          _language = _context2.sent;
          pageSize = cuIDsToFetch.length;
          _context2.next = 31;
          return (0, _effects.call)(_Api2.default.units, { id: cuIDsToFetch, pageSize: pageSize, language: _language });

        case 31:
          resp = _context2.sent;
          _context2.next = 34;
          return (0, _effects.put)(_mdb.actions.receiveContentUnits(resp.data.content_units));

        case 34:
          _context2.next = 36;
          return (0, _effects.put)(_search.actions.searchSuccess(data));

        case 36:
          _context2.next = 42;
          break;

        case 38:
          _context2.prev = 38;
          _context2.t1 = _context2['catch'](0);
          _context2.next = 42;
          return (0, _effects.put)(_search.actions.searchFailure(_context2.t1));

        case 42:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this, [[0, 38]]);
}

function updatePageInQuery(action) {
  var page;
  return _regenerator2.default.wrap(function updatePageInQuery$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          page = action.payload > 1 ? action.payload : null;
          return _context3.delegateYield((0, _url.updateQuery)(function (query) {
            return Object.assign(query, { page: page });
          }), 't0', 2);

        case 2:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3, this);
}

function updateSortByInQuery(action) {
  var sortBy;
  return _regenerator2.default.wrap(function updateSortByInQuery$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          sortBy = action.payload;
          return _context4.delegateYield((0, _url.updateQuery)(function (query) {
            return Object.assign(query, { sort_by: sortBy });
          }), 't0', 2);

        case 2:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked4, this);
}

function hydrateUrl() {
  var query, q, _query$page, page, pageNo;

  return _regenerator2.default.wrap(function hydrateUrl$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.delegateYield((0, _url.getQuery)(), 't0', 1);

        case 1:
          query = _context5.t0;
          q = query.q, _query$page = query.page, page = _query$page === undefined ? '1' : _query$page;

          if (!q) {
            _context5.next = 12;
            break;
          }

          _context5.next = 6;
          return (0, _effects.put)(_search.actions.updateQuery(q));

        case 6:
          if (!query.sort_by) {
            _context5.next = 9;
            break;
          }

          _context5.next = 9;
          return (0, _effects.put)(_search.actions.setSortBy(query.sort_by));

        case 9:
          pageNo = parseInt(page, 10);
          _context5.next = 12;
          return (0, _effects.put)(_search.actions.setPage(pageNo));

        case 12:
        case 'end':
          return _context5.stop();
      }
    }
  }, _marked5, this);
}

function watchAutocomplete() {
  return _regenerator2.default.wrap(function watchAutocomplete$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return (0, _effects.takeLatest)(_search.types.AUTOCOMPLETE, autocomplete);

        case 2:
        case 'end':
          return _context6.stop();
      }
    }
  }, _marked6, this);
}

function watchSearch() {
  return _regenerator2.default.wrap(function watchSearch$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return (0, _effects.takeLatest)(_search.types.SEARCH, search);

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
          return (0, _effects.takeLatest)(_search.types.SET_PAGE, updatePageInQuery);

        case 2:
        case 'end':
          return _context8.stop();
      }
    }
  }, _marked8, this);
}

function watchSetSortBy() {
  return _regenerator2.default.wrap(function watchSetSortBy$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return (0, _effects.takeLatest)(_search.types.SET_SORT_BY, updateSortByInQuery);

        case 2:
        case 'end':
          return _context9.stop();
      }
    }
  }, _marked9, this);
}

function watchHydrateUrl() {
  return _regenerator2.default.wrap(function watchHydrateUrl$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return (0, _effects.takeLatest)(_search.types.HYDRATE_URL, hydrateUrl);

        case 2:
        case 'end':
          return _context10.stop();
      }
    }
  }, _marked10, this);
}

var sagas = exports.sagas = [watchAutocomplete, watchSearch, watchSetPage, watchSetSortBy, watchHydrateUrl];