import { createAction, handleActions } from 'redux-actions';

import { CT_CONGRESS, EVENT_TYPES } from '../../helpers/consts';
import i18n from '../../helpers/i18nnext';
import { types as settings } from './settings';
import { selectors as mdb } from './mdb';

const ALL_EVENTS    = 'ALLEVENTS';
const ALL_COUNTRIES = 'ALLCOUNTRIES';
const ALL_CITIES    = 'ALLCITIES';

/* Types */

const SET_PAGE = 'Events/SET_PAGE';

const FETCH_ALL_EVENTS         = 'Events/FETCH_ALL_EVENTS';
const FETCH_ALL_EVENTS_SUCCESS = 'Events/FETCH_ALL_EVENTS_SUCCESS';
const FETCH_ALL_EVENTS_FAILURE = 'Events/FETCH_ALL_EVENTS_FAILURE';
const FETCH_EVENT_ITEM         = 'Event/FETCH_EVENT_ITEM';
const FETCH_EVENT_ITEM_SUCCESS = 'Event/FETCH_EVENT_ITEM_SUCCESS';
const FETCH_EVENT_ITEM_FAILURE = 'Event/FETCH_EVENT_ITEM_FAILURE';
const FETCH_FULL_EVENT         = 'Event/FETCH_FULL_EVENT';
const FETCH_FULL_EVENT_SUCCESS = 'Event/FETCH_FULL_EVENT_SUCCESS';
const FETCH_FULL_EVENT_FAILURE = 'Event/FETCH_FULL_EVENT_FAILURE';

export const types = {
  SET_PAGE,
  FETCH_ALL_EVENTS,
  FETCH_ALL_EVENTS_SUCCESS,
  FETCH_ALL_EVENTS_FAILURE,
  FETCH_EVENT_ITEM,
  FETCH_EVENT_ITEM_SUCCESS,
  FETCH_EVENT_ITEM_FAILURE,
  FETCH_FULL_EVENT,
  FETCH_FULL_EVENT_SUCCESS,
  FETCH_FULL_EVENT_FAILURE,
};

/* Actions */

const setPage               = createAction(SET_PAGE);
const fetchAllEvents        = createAction(FETCH_ALL_EVENTS);
const fetchAllEventsSuccess = createAction(FETCH_ALL_EVENTS_SUCCESS);
const fetchAllEventsFailure = createAction(FETCH_ALL_EVENTS_FAILURE);
const fetchEventItem        = createAction(FETCH_EVENT_ITEM);
const fetchEventItemSuccess = createAction(FETCH_EVENT_ITEM_SUCCESS);
const fetchEventItemFailure = createAction(FETCH_EVENT_ITEM_FAILURE, (id, err) => ({ id, err }));
const fetchFullEvent        = createAction(FETCH_FULL_EVENT);
const fetchFullEventSuccess = createAction(FETCH_FULL_EVENT_SUCCESS);
const fetchFullEventFailure = createAction(FETCH_FULL_EVENT_FAILURE, (id, err) => ({ id, err }));

export const actions = {
  setPage,
  fetchAllEvents,
  fetchAllEventsSuccess,
  fetchAllEventsFailure,
  fetchEventItem,
  fetchEventItemSuccess,
  fetchEventItemFailure,
  fetchFullEvent,
  fetchFullEventSuccess,
  fetchFullEventFailure,
};

/* Reducer */

const initialState = {
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
const setStatus = (state, action) => {
  const wip    = { ...state.wip };
  const errors = { ...state.errors };

  switch (action.type) {
  case FETCH_ALL_EVENTS:
    wip.list = true;
    break;
  case FETCH_EVENT_ITEM:
    wip.items = { ...wip.items, [action.payload]: true };
    break;
  case FETCH_FULL_EVENT:
    wip.fulls = { ...wip.fulls, [action.payload]: true };
    break;
  case FETCH_ALL_EVENTS_SUCCESS:
    wip.list    = false;
    errors.list = null;
    break;
  case FETCH_EVENT_ITEM_SUCCESS:
    wip.items    = { ...wip.items, [action.payload]: false };
    errors.items = { ...errors.items, [action.payload]: null };
    break;
  case FETCH_FULL_EVENT_SUCCESS:
    wip.fulls    = { ...wip.fulls, [action.payload]: false };
    errors.fulls = { ...errors.fulls, [action.payload]: null };
    break;
  case FETCH_ALL_EVENTS_FAILURE:
    wip.list    = false;
    errors.list = action.payload;
    break;
  case FETCH_EVENT_ITEM_FAILURE:
    wip.items    = { ...wip.items, [action.payload.id]: false };
    errors.items = { ...errors.items, [action.payload.id]: action.payload.err };
    break;
  case FETCH_FULL_EVENT_FAILURE:
    wip.fulls    = { ...wip.fulls, [action.payload.id]: false };
    errors.fulls = { ...errors.fulls, [action.payload.id]: action.payload.err };
    break;
  default:
    break;
  }

  return {
    ...state,
    wip,
    errors,
  };
};

const createItem = (id, name, children, typeName, extra) =>
  ({ id, name, children, typeName, ...extra });

const onFetchAllEventsSuccess = (state, action) => {
  const roots = [ALL_EVENTS, ...EVENT_TYPES];

  const allCities    = createItem(ALL_CITIES, i18n.t('filters.event-types-filter.allItem'), [], 'city');
  const allCountries = createItem(ALL_COUNTRIES, i18n.t('filters.event-types-filter.allItem'), [ALL_CITIES], 'country');

  const { countries, cities } = action.payload.collections.reduce((acc, collection) => {
    const country = collection.country;
    if (country && !acc.countries[country]) {
      acc.countries[country] = createItem(country, country, [ALL_CITIES], 'country');
    }

    const city = collection.city;
    if (city && !acc.cities[city]) {
      acc.cities[city] = createItem(city, city, [], 'city', { parentId: country });
    }

    return acc;
  }, { countries: {}, cities: {} });

  const events = (EVENT_TYPES.reduce((acc, event) => {
    acc[event] = createItem(event, i18n.t(`constants.content-types.${event}`), [], 'content_type');
    return acc;
  }, {}));

  // populate cities as children of their parent countries
  Object.keys(cities).forEach((city) => {
    const parent = cities[city].parentId;
    if (parent) {
      countries[parent].children.push(city);
    }

    allCountries.children.push(city);
  });

  Object.keys(countries).forEach(country => countries[country].children.sort());

  const allCountriesListSorted = [ALL_COUNTRIES].concat(Object.keys(countries)).sort();
  events[CT_CONGRESS].children = allCountriesListSorted;
  // TODO: (yaniv): CT_HOLIDAY data is missing

  return ({
    ...state,
    ...setStatus(state, action),
    total: action.payload.total,
    items: action.payload.collections.map(x => [x.id, x.content_type]),
    eventsFilterTree: {
      roots,
      byIds: {
        [ALL_EVENTS]: createItem(
          ALL_EVENTS,
          i18n.t('filters.event-types-filter.all'),
          allCountriesListSorted,
          'content_type'
        ),
        [ALL_CITIES]: allCities,
        [ALL_COUNTRIES]: allCountries,
        ...events,
        ...countries,
        ...cities
      }
    }
  });
};

const onFetchAllEventsFailure = (state, action) => ({
  ...state,
  ...setStatus(state, action),
  eventsFilterTree: {
    ...initialState.eventsFilterTree
  }
});

const onSetLanguage = state => (
  {
    ...state,
    items: [],
  }
);

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_ALL_EVENTS]: setStatus,
  [FETCH_ALL_EVENTS_SUCCESS]: onFetchAllEventsSuccess,
  [FETCH_ALL_EVENTS_FAILURE]: onFetchAllEventsFailure,
  [FETCH_EVENT_ITEM]: setStatus,
  [FETCH_EVENT_ITEM_SUCCESS]: setStatus,
  [FETCH_EVENT_ITEM_FAILURE]: setStatus,
  [FETCH_FULL_EVENT]: setStatus,
  [FETCH_FULL_EVENT_SUCCESS]: setStatus,
  [FETCH_FULL_EVENT_FAILURE]: setStatus,
}, initialState);

/* Selectors */

const cityPredicate        = (item, city) => city === ALL_CITIES || item.city === city;
const countryPredicate     = (item, country) => country === ALL_COUNTRIES || item.country === country;
const contentTypePredicate = (item, contentType) => contentType === ALL_EVENTS || item.content_type === contentType;
const yearPredicate        = (item, year) =>
  item.start_date.substring(0, 4) <= year && year <= item.end_date.substring(0, 4);
// TODO: (yaniv) add holiday filter predicate

const getFilteredData = (state, filters, mdbState) => {
  const groupedFilters = filters.reduce((acc, filter) => {
    acc[filter.name] = filter;
    return acc;
  }, {});

  const yearsFilter      = groupedFilters['years-filter'];
  const eventTypesFilter = groupedFilters['event-types-filter'];
  const years            = (yearsFilter && yearsFilter.values) || [];
  const eventTypes       = (eventTypesFilter && eventTypesFilter.values) || [];

  return state.items.reduce((acc, shortItem) => {
    const item = mdb.getDenormCollection(mdbState, shortItem[0]);
    if (years.length > 0 && !years.some(year => yearPredicate(item, year))) {
      return acc;
    }

    if (eventTypes.length > 0) {
      const pass = eventTypes.some((eventType) => {
        if (eventType.length > 0) {
          if (!contentTypePredicate(item, eventType[0])) {
            return false;
          }

          if (eventType.length > 1) {
            if (eventType.length > 2) {
              const obj2 = state.eventsFilterTree.byIds[eventType[2]];
              if (obj2.typeName === 'city') {
                if (!cityPredicate(item, eventType[2])) {
                  return false;
                }
              }
              // TODO (yaniv): handle holiday for eventType[2]
            }

            const obj1 = state.eventsFilterTree.byIds[eventType[1]];
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

const getTotal  = state => state.total;
const getItems  = state => state.items;
const getPageNo = state => state.pageNo;
const getWip    = state => state.wip;
const getErrors = state => state.errors;

const getEventFilterTree = state => state.eventsFilterTree;

export const selectors = {
  getFilteredData,
  getTotal,
  getItems,
  getPageNo,
  getWip,
  getErrors,
  getEventFilterTree
};
