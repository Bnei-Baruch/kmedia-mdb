import { createAction, handleActions } from 'redux-actions';

import { isEmpty } from '../../helpers/utils';
import { types as settings } from './settings';
import { types as ssr } from './ssr';
import { selectors as mdb } from './mdb';

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

const onFetchAllEventsSuccess = (state, action) => {
  const { collections } = action.payload;

  // Map event IDs by content_type
  const eventsByType = collections.reduce((acc, val) => {
    const { id, content_type: ct } = val;

    let v = acc[ct];
    if (!v) {
      v = [];
    }
    v.push(id);
    acc[ct] = v;

    return acc;
  }, {});

  return {
    ...state,
    eventsByType,
  };
};

const onSetLanguage = state => (
  {
    ...state,
    eventsByType: {},
  }
);

const onSSRPrepare = state => ({
  ...state,
  errors: {
    collections: state.errors.collections ? state.errors.collections.toString() : state.errors.collections
  }
});

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
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
  values.some((v) => {
    const [country, city] = v;
    return country === x.country && (!city || city === x.city);
  });

const makeHolidaysPredicate = values => x =>
  isEmpty(values) ||
  values.some(v => x.holiday_id === v[0]);

const predicateMap = {
  'years-filter': makeYearsPredicate,
  'locations-filter': makeLocationsPredicate,
  'holidays-filter': makeHolidaysPredicate,
};

const getFilteredData = (state, type, filtersState, mdbState) => {
  const predicates = filtersState.map(x => predicateMap[x.name](x.values)) || [];

  return (state.eventsByType[type] || []).filter((x) => {
    const collection = mdb.getCollectionById(mdbState, x);
    return predicates.every(p => p(collection));
  });
};

const getWip           = state => state.wip;
const getErrors        = state => state.errors;
const getEventsByType  = state => state.eventsByType;
const getLocationsTree = state => state.locationsTree;
const getHolidaysTree  = state => state.holidaysTree;

export const selectors = {
  getWip,
  getErrors,
  getEventsByType,
  getFilteredData,
  getLocationsTree,
  getHolidaysTree,
};
