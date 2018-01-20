'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectors = exports.reducer = exports.actions = exports.types = undefined;

var _handleActions;

var _reduxActions = require('redux-actions');

var _consts = require('../../helpers/consts');

var _i18nnext = require('../../helpers/i18nnext');

var _i18nnext2 = _interopRequireDefault(_i18nnext);

var _settings = require('./settings');

var _mdb = require('./mdb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ALL_EVENTS = 'ALLEVENTS';
var ALL_COUNTRIES = 'ALLCOUNTRIES';
var ALL_CITIES = 'ALLCITIES';

/* Types */

var SET_PAGE = 'Events/SET_PAGE';

var FETCH_ALL_EVENTS = 'Events/FETCH_ALL_EVENTS';
var FETCH_ALL_EVENTS_SUCCESS = 'Events/FETCH_ALL_EVENTS_SUCCESS';
var FETCH_ALL_EVENTS_FAILURE = 'Events/FETCH_ALL_EVENTS_FAILURE';
var FETCH_EVENT_ITEM = 'Event/FETCH_EVENT_ITEM';
var FETCH_EVENT_ITEM_SUCCESS = 'Event/FETCH_EVENT_ITEM_SUCCESS';
var FETCH_EVENT_ITEM_FAILURE = 'Event/FETCH_EVENT_ITEM_FAILURE';
var FETCH_FULL_EVENT = 'Event/FETCH_FULL_EVENT';
var FETCH_FULL_EVENT_SUCCESS = 'Event/FETCH_FULL_EVENT_SUCCESS';
var FETCH_FULL_EVENT_FAILURE = 'Event/FETCH_FULL_EVENT_FAILURE';

var types = exports.types = {
  SET_PAGE: SET_PAGE,
  FETCH_ALL_EVENTS: FETCH_ALL_EVENTS,
  FETCH_ALL_EVENTS_SUCCESS: FETCH_ALL_EVENTS_SUCCESS,
  FETCH_ALL_EVENTS_FAILURE: FETCH_ALL_EVENTS_FAILURE,
  FETCH_EVENT_ITEM: FETCH_EVENT_ITEM,
  FETCH_EVENT_ITEM_SUCCESS: FETCH_EVENT_ITEM_SUCCESS,
  FETCH_EVENT_ITEM_FAILURE: FETCH_EVENT_ITEM_FAILURE,
  FETCH_FULL_EVENT: FETCH_FULL_EVENT,
  FETCH_FULL_EVENT_SUCCESS: FETCH_FULL_EVENT_SUCCESS,
  FETCH_FULL_EVENT_FAILURE: FETCH_FULL_EVENT_FAILURE
};

/* Actions */

var setPage = (0, _reduxActions.createAction)(SET_PAGE);
var fetchAllEvents = (0, _reduxActions.createAction)(FETCH_ALL_EVENTS);
var fetchAllEventsSuccess = (0, _reduxActions.createAction)(FETCH_ALL_EVENTS_SUCCESS);
var fetchAllEventsFailure = (0, _reduxActions.createAction)(FETCH_ALL_EVENTS_FAILURE);
var fetchEventItem = (0, _reduxActions.createAction)(FETCH_EVENT_ITEM);
var fetchEventItemSuccess = (0, _reduxActions.createAction)(FETCH_EVENT_ITEM_SUCCESS);
var fetchEventItemFailure = (0, _reduxActions.createAction)(FETCH_EVENT_ITEM_FAILURE, function (id, err) {
  return { id: id, err: err };
});
var fetchFullEvent = (0, _reduxActions.createAction)(FETCH_FULL_EVENT);
var fetchFullEventSuccess = (0, _reduxActions.createAction)(FETCH_FULL_EVENT_SUCCESS);
var fetchFullEventFailure = (0, _reduxActions.createAction)(FETCH_FULL_EVENT_FAILURE, function (id, err) {
  return { id: id, err: err };
});

var actions = exports.actions = {
  setPage: setPage,
  fetchAllEvents: fetchAllEvents,
  fetchAllEventsSuccess: fetchAllEventsSuccess,
  fetchAllEventsFailure: fetchAllEventsFailure,
  fetchEventItem: fetchEventItem,
  fetchEventItemSuccess: fetchEventItemSuccess,
  fetchEventItemFailure: fetchEventItemFailure,
  fetchFullEvent: fetchFullEvent,
  fetchFullEventSuccess: fetchFullEventSuccess,
  fetchFullEventFailure: fetchFullEventFailure
};

/* Reducer */

var initialState = {
  total: 0,
  items: [],
  pageNo: 1,
  wip: {
    list: false,
    items: {},
    fulls: {}
  },
  errors: {
    list: null,
    items: {},
    fulls: {}
  },
  eventsFilterTree: {
    byIds: {},
    roots: []
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
    case FETCH_ALL_EVENTS:
      wip.list = true;
      break;
    case FETCH_EVENT_ITEM:
      wip.items = Object.assign({}, wip.items, _defineProperty({}, action.payload, true));
      break;
    case FETCH_FULL_EVENT:
      wip.fulls = Object.assign({}, wip.fulls, _defineProperty({}, action.payload, true));
      break;
    case FETCH_ALL_EVENTS_SUCCESS:
      wip.list = false;
      errors.list = null;
      break;
    case FETCH_EVENT_ITEM_SUCCESS:
      wip.items = Object.assign({}, wip.items, _defineProperty({}, action.payload, false));
      errors.items = Object.assign({}, errors.items, _defineProperty({}, action.payload, null));
      break;
    case FETCH_FULL_EVENT_SUCCESS:
      wip.fulls = Object.assign({}, wip.fulls, _defineProperty({}, action.payload, false));
      errors.fulls = Object.assign({}, errors.fulls, _defineProperty({}, action.payload, null));
      break;
    case FETCH_ALL_EVENTS_FAILURE:
      wip.list = false;
      errors.list = action.payload;
      break;
    case FETCH_EVENT_ITEM_FAILURE:
      wip.items = Object.assign({}, wip.items, _defineProperty({}, action.payload.id, false));
      errors.items = Object.assign({}, errors.items, _defineProperty({}, action.payload.id, action.payload.err));
      break;
    case FETCH_FULL_EVENT_FAILURE:
      wip.fulls = Object.assign({}, wip.fulls, _defineProperty({}, action.payload.id, false));
      errors.fulls = Object.assign({}, errors.fulls, _defineProperty({}, action.payload.id, action.payload.err));
      break;
    default:
      break;
  }

  return Object.assign({}, state, {
    wip: wip,
    errors: errors
  });
};

var createItem = function createItem(id, name, children, typeName, extra) {
  return Object.assign({ id: id, name: name, children: children, typeName: typeName }, extra);
};

var onFetchAllEventsSuccess = function onFetchAllEventsSuccess(state, action) {
  var _Object$assign11;

  var roots = [ALL_EVENTS].concat(_toConsumableArray(_consts.EVENT_TYPES));

  var allCities = createItem(ALL_CITIES, _i18nnext2.default.t('filters.event-types-filter.allItem'), [], 'city');
  var allCountries = createItem(ALL_COUNTRIES, _i18nnext2.default.t('filters.event-types-filter.allItem'), [ALL_CITIES], 'country');

  var _action$payload$colle = action.payload.collections.reduce(function (acc, collection) {
    var country = collection.country;
    if (country && !acc.countries[country]) {
      acc.countries[country] = createItem(country, country, [ALL_CITIES], 'country');
    }

    var city = collection.city;
    if (city && !acc.cities[city]) {
      acc.cities[city] = createItem(city, city, [], 'city', { parentId: country });
    }

    return acc;
  }, { countries: {}, cities: {} }),
      countries = _action$payload$colle.countries,
      cities = _action$payload$colle.cities;

  var events = _consts.EVENT_TYPES.reduce(function (acc, event) {
    acc[event] = createItem(event, _i18nnext2.default.t('constants.content-types.' + event), [], 'content_type');
    return acc;
  }, {});

  // populate cities as children of their parent countries
  Object.keys(cities).forEach(function (city) {
    var parent = cities[city].parentId;
    if (parent) {
      countries[parent].children.push(city);
    }

    allCountries.children.push(city);
  });

  Object.keys(countries).forEach(function (country) {
    return countries[country].children.sort();
  });

  var allCountriesListSorted = [ALL_COUNTRIES].concat(Object.keys(countries)).sort();
  events[_consts.CT_CONGRESS].children = allCountriesListSorted;
  // TODO: (yaniv): CT_HOLIDAY data is missing

  return Object.assign({}, state, setStatus(state, action), {
    total: action.payload.total,
    items: action.payload.collections.map(function (x) {
      return [x.id, x.content_type];
    }),
    eventsFilterTree: {
      roots: roots,
      byIds: Object.assign((_Object$assign11 = {}, _defineProperty(_Object$assign11, ALL_EVENTS, createItem(ALL_EVENTS, _i18nnext2.default.t('filters.event-types-filter.all'), allCountriesListSorted, 'content_type')), _defineProperty(_Object$assign11, ALL_CITIES, allCities), _defineProperty(_Object$assign11, ALL_COUNTRIES, allCountries), _Object$assign11), events, countries, cities)
    }
  });
};

var onFetchAllEventsFailure = function onFetchAllEventsFailure(state, action) {
  return Object.assign({}, state, setStatus(state, action), {
    eventsFilterTree: Object.assign({}, initialState.eventsFilterTree)
  });
};

var onSetLanguage = function onSetLanguage(state) {
  return Object.assign({}, state, {
    items: []
  });
};

var reducer = exports.reducer = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, _settings.types.SET_LANGUAGE, onSetLanguage), _defineProperty(_handleActions, FETCH_ALL_EVENTS, setStatus), _defineProperty(_handleActions, FETCH_ALL_EVENTS_SUCCESS, onFetchAllEventsSuccess), _defineProperty(_handleActions, FETCH_ALL_EVENTS_FAILURE, onFetchAllEventsFailure), _defineProperty(_handleActions, FETCH_EVENT_ITEM, setStatus), _defineProperty(_handleActions, FETCH_EVENT_ITEM_SUCCESS, setStatus), _defineProperty(_handleActions, FETCH_EVENT_ITEM_FAILURE, setStatus), _defineProperty(_handleActions, FETCH_FULL_EVENT, setStatus), _defineProperty(_handleActions, FETCH_FULL_EVENT_SUCCESS, setStatus), _defineProperty(_handleActions, FETCH_FULL_EVENT_FAILURE, setStatus), _handleActions), initialState);

/* Selectors */

var cityPredicate = function cityPredicate(item, city) {
  return city === ALL_CITIES || item.city === city;
};
var countryPredicate = function countryPredicate(item, country) {
  return country === ALL_COUNTRIES || item.country === country;
};
var contentTypePredicate = function contentTypePredicate(item, contentType) {
  return contentType === ALL_EVENTS || item.content_type === contentType;
};
var yearPredicate = function yearPredicate(item, year) {
  return item.start_date.substring(0, 4) <= year && year <= item.end_date.substring(0, 4);
};
// TODO: (yaniv) add holiday filter predicate

var getFilteredData = function getFilteredData(state, filters, mdbState) {
  var groupedFilters = filters.reduce(function (acc, filter) {
    acc[filter.name] = filter;
    return acc;
  }, {});

  var yearsFilter = groupedFilters['years-filter'];
  var eventTypesFilter = groupedFilters['event-types-filter'];
  var years = yearsFilter && yearsFilter.values || [];
  var eventTypes = eventTypesFilter && eventTypesFilter.values || [];

  return state.items.reduce(function (acc, shortItem) {
    var item = _mdb.selectors.getDenormCollection(mdbState, shortItem[0]);
    if (years.length > 0 && !years.some(function (year) {
      return yearPredicate(item, year);
    })) {
      return acc;
    }

    if (eventTypes.length > 0) {
      var pass = eventTypes.some(function (eventType) {
        if (eventType.length > 0) {
          if (!contentTypePredicate(item, eventType[0])) {
            return false;
          }

          if (eventType.length > 1) {
            if (eventType.length > 2) {
              var obj2 = state.eventsFilterTree.byIds[eventType[2]];
              if (obj2.typeName === 'city') {
                if (!cityPredicate(item, eventType[2])) {
                  return false;
                }
              }
              // TODO (yaniv): handle holiday for eventType[2]
            }

            var obj1 = state.eventsFilterTree.byIds[eventType[1]];
            if (obj1.typeName === 'country') {
              if (!countryPredicate(item, eventType[1])) {
                return false;
              }
            }
            // TODO (yaniv): handle holiday for eventType[1]
          }
        }

        return true;
      });

      if (!pass) {
        return acc;
      }
    }

    acc.push(item);
    return acc;
  }, []);
};

var getTotal = function getTotal(state) {
  return state.total;
};
var getItems = function getItems(state) {
  return state.items;
};
var getPageNo = function getPageNo(state) {
  return state.pageNo;
};
var getWip = function getWip(state) {
  return state.wip;
};
var getErrors = function getErrors(state) {
  return state.errors;
};

var getEventFilterTree = function getEventFilterTree(state) {
  return state.eventsFilterTree;
};

var selectors = exports.selectors = {
  getFilteredData: getFilteredData,
  getTotal: getTotal,
  getItems: getItems,
  getPageNo: getPageNo,
  getWip: getWip,
  getErrors: getErrors,
  getEventFilterTree: getEventFilterTree
};