import { createAction, handleActions } from 'redux-actions';

import { isEmpty } from '../../helpers/utils';
import i18n from '../../helpers/i18nnext';
import { types as settings } from './settings';
import { selectors as mdb } from './mdb';

const ALL_COUNTRIES = 'ALLCOUNTRIES';
const ALL_CITIES    = 'ALLCITIES';
const ALL_HOLIDAYS  = 'ALLHOLIDAYS';

/* Types */

const SET_TAB = 'Events/SET_TAB';

const FETCH_ALL_EVENTS         = 'Events/FETCH_ALL_EVENTS';
const FETCH_ALL_EVENTS_SUCCESS = 'Events/FETCH_ALL_EVENTS_SUCCESS';
const FETCH_ALL_EVENTS_FAILURE = 'Events/FETCH_ALL_EVENTS_FAILURE';

export const types = {
  SET_TAB,

  FETCH_ALL_EVENTS,
  FETCH_ALL_EVENTS_SUCCESS,
  FETCH_ALL_EVENTS_FAILURE,
};

/* Actions */

const setTab = createAction(SET_TAB);

const fetchAllEvents        = createAction(FETCH_ALL_EVENTS);
const fetchAllEventsSuccess = createAction(FETCH_ALL_EVENTS_SUCCESS);
const fetchAllEventsFailure = createAction(FETCH_ALL_EVENTS_FAILURE);

export const actions = {
  setTab,

  fetchAllEvents,
  fetchAllEventsSuccess,
  fetchAllEventsFailure,
};

/* Reducer */

const initialState = {
  total: 0,
  items: [],
  pageNo: 1,
  wip: {
    collections: false,
  },
  errors: {
    collections: null,
  },
  eventsByType: {},
  locationsTree: {
    byIds: {},
    roots: []
  },
  holidaysTree: {
    byIds: {},
    roots: []
  },
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
    wip.collections = true;
    break;
  case FETCH_ALL_EVENTS_SUCCESS:
    wip.collections    = false;
    errors.collections = null;
    break;
  case FETCH_ALL_EVENTS_FAILURE:
    wip.collections    = false;
    errors.collections = action.payload;
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
  const collections = action.payload.collections;

  // Map event IDs by content_type
  const eventsByType = collections.reduce((acc, val) => {
    const { id, content_type: ct } = val;
    let v                          = acc[ct];
    if (!v) {
      v = [];
    }
    v.push(id);
    acc[ct] = v;
    return acc;
  }, {});

  // build locations tree (country, city)
  const allCities    = createItem(ALL_CITIES, i18n.t('filters.locations-filter.allItem'), [], 'city');
  const allCountries = createItem(ALL_COUNTRIES, i18n.t('filters.locations-filter.allItem'), [ALL_CITIES], 'country');

  const { countries, cities } = collections.reduce((acc, collection) => {
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

  // populate cities as children of their parent countries
  Object.keys(cities).forEach((city) => {
    const parent = cities[city].parentId;
    if (parent) {
      countries[parent].children.push(city);
    }

    allCountries.children.push(city);
  });

  Object.keys(countries).forEach(country => countries[country].children.sort());

  const locationsTree = {
    roots: [ALL_COUNTRIES].concat(Object.keys(countries).sort()),
    byIds: {
      [ALL_CITIES]: allCities,
      [ALL_COUNTRIES]: allCountries,
      ...countries,
      ...cities
    }
  };

  // build holidays tree (holiday)
  const allHolidays = createItem(ALL_HOLIDAYS, i18n.t('filters.holidays-filter.allItem'), [], 'holiday');

  const holidays = collections.reduce((acc, collection) => {
    const { holiday_id: holiday } = collection;
    if (holiday && !acc[holiday]) {
      acc[holiday] = createItem(holiday, holiday, [], 'holiday');
    }

    return acc;
  }, {});

  const holidaysTree = {
    roots: [ALL_HOLIDAYS].concat(Object.keys(holidays).sort()),
    byIds: {
      [ALL_HOLIDAYS]: allHolidays,
      ...holidays,
    }
  };

  return {
    ...state,
    eventsByType,
    locationsTree,
    holidaysTree,
  };
};

const onSetLanguage = state => (
  {
    ...state,
    eventsByType: {},
  }
);

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_ALL_EVENTS]: setStatus,
  [FETCH_ALL_EVENTS_SUCCESS]: (state, action) => setStatus(onFetchAllEventsSuccess(state, action), action),
  [FETCH_ALL_EVENTS_FAILURE]: setStatus,
}, initialState);

/* Selectors */

const makeYearsPredicate = values => x =>
  isEmpty(values) ||
  values.some(v =>
    x.start_date.substring(0, 4) <= v && v <= x.end_date.substring(0, 4)
  );

const makeLocationsPredicate = values => x =>
  isEmpty(values) ||
  values.some(v => {
    const [country, city] = v;
    if (country === ALL_COUNTRIES) {
      return true;
    }

    if (country !== x.country) {
      return false;
    }

    if (!city || city === ALL_CITIES) {
      return true;
    }

    return city === x.city;
  });

const makeHolidaysPredicate = values => x =>
  isEmpty(values) ||
  values.some(v =>
    v[0] === ALL_HOLIDAYS || x.holiday_id === v[0]
  );

const predicateMap = {
  'years-filter': makeYearsPredicate,
  'locations-filter': makeLocationsPredicate,
  'holidays-filter': makeHolidaysPredicate,
};

const getFilteredData = (state, type, filtersState, mdbState) => {
  const predicates = filtersState.map(x => predicateMap[x.name](x.values)) || [];

  return (state.eventsByType[type] || []).filter(x => {
    const collection = mdb.getCollectionById(mdbState, x);
    return predicates.every(p => p(collection));
  });
};

const getWip    = state => state.wip;
const getErrors = state => state.errors;
const getLocationsTree   = state => state.locationsTree;
const getHolidaysTree    = state => state.holidaysTree;

export const selectors = {
  getWip,
  getErrors,
  getFilteredData,
  getLocationsTree,
  getHolidaysTree,
};
