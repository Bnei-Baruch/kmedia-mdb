import { createAction, handleActions } from 'redux-actions';
import i18n from '../../helpers/i18nnext';
import { types as settings } from './settings';
import { CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY, EVENT_TYPES } from '../../helpers/consts';

/* Types */

const SET_PAGE = 'Events/SET_PAGE';

const FETCH_ALL_EVENTS              = 'Events/FETCH_ALL_EVENTS';
const FETCH_ALL_EVENTS_SUCCESS      = 'Events/FETCH_ALL_EVENTS_SUCCESS';
const FETCH_ALL_EVENTS_FAILURE      = 'Events/FETCH_ALL_EVENTS_FAILURE';
const FETCH_LIST                    = 'Events/FETCH_LIST';
const FETCH_LIST_SUCCESS            = 'Events/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE            = 'Events/FETCH_LIST_FAILURE';
const FETCH_EVENT_ITEM         = 'Event/FETCH_EVENT_ITEM';
const FETCH_EVENT_ITEM_SUCCESS = 'Event/FETCH_EVENT_ITEM_SUCCESS';
const FETCH_EVENT_ITEM_FAILURE = 'Event/FETCH_EVENT_ITEM_FAILURE';
const FETCH_FULL_EVENT            = 'Event/FETCH_FULL_EVENT';
const FETCH_FULL_EVENT_SUCCESS    = 'Event/FETCH_FULL_EVENT_SUCCESS';
const FETCH_FULL_EVENT_FAILURE    = 'Event/FETCH_FULL_EVENT_FAILURE';

export const types = {
  SET_PAGE,
  FETCH_ALL_EVENTS,
  FETCH_ALL_EVENTS_SUCCESS,
  FETCH_ALL_EVENTS_FAILURE,
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
  FETCH_EVENT_ITEM,
  FETCH_EVENT_ITEM_SUCCESS,
  FETCH_EVENT_ITEM_FAILURE,
  FETCH_FULL_EVENT,
  FETCH_FULL_EVENT_SUCCESS,
  FETCH_FULL_EVENT_FAILURE,
};

/* Actions */

const setPage                    = createAction(SET_PAGE);
const fetchAllEvents           = createAction(FETCH_ALL_EVENTS);
const fetchAllEventsSuccess           = createAction(FETCH_ALL_EVENTS_SUCCESS);
const fetchAllEventsFailure           = createAction(FETCH_ALL_EVENTS_FAILURE);
const fetchList                  = createAction(FETCH_LIST, (pageNo, language, pageSize, contentTypes) => ({
  contentTypes,
  pageNo,
  language,
  pageSize
}));
const fetchListSuccess           = createAction(FETCH_LIST_SUCCESS);
const fetchListFailure           = createAction(FETCH_LIST_FAILURE);
const fetchEventItem        = createAction(FETCH_EVENT_ITEM);
const fetchEventItemSuccess = createAction(FETCH_EVENT_ITEM_SUCCESS);
const fetchEventItemFailure = createAction(FETCH_EVENT_ITEM_FAILURE, (id, err) => ({ id, err }));
const fetchFullEvent           = createAction(FETCH_FULL_EVENT);
const fetchFullEventSuccess    = createAction(FETCH_FULL_EVENT_SUCCESS);
const fetchFullEventFailure    = createAction(FETCH_FULL_EVENT_FAILURE, (id, err) => ({ id, err }));

export const actions = {
  setPage,
  fetchAllEvents,
  fetchAllEventsSuccess,
  fetchAllEventsFailure,
  fetchList,
  fetchListSuccess,
  fetchListFailure,
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
  case FETCH_LIST:
    wip.list = true;
    break;
  case FETCH_EVENT_ITEM:
    wip.items = { ...wip.items, [action.payload]: true };
    break;
  case FETCH_FULL_EVENT:
    wip.fulls = { ...wip.fulls, [action.payload]: true };
    break;
  case FETCH_LIST_SUCCESS:
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
  case FETCH_LIST_FAILURE:
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

const onFetchListSuccess = (state, action) => {
  const items = action.payload.collections || [];
  return {
    ...state,
    total: action.payload.total,
    items: items.map(x => [x.id, x.content_type]),
  };
};

const onFetchAllEventsSuccess = (state, action) => {
  const ALL_EVENTS = 'ALL_EVENTS';
  const roots = [ALL_EVENTS, ...EVENT_TYPES];

  const { countries, cities } = action.payload.collections.reduce((acc, collection) => {
    const country = collection.country;
    if (country && !acc.countries[country]) {
      acc.countries[country] = {
        id: country,
        name: country,
        children: []
      };
    }

    const city = collection.city;
    if (city && !acc.cities[city]) {
      acc.cities[city] = {
        id: city,
        name: city,
        children: [],
        parentId: country
      };
    }

    return acc;
  }, { countries: {}, cities: {} });

  // populate cities as children of their parent countries
  Object.keys(cities).forEach((city) => {
    const parent = cities[city].parentId;
    if (parent) {
      countries[parent].children.push(city);
    }
  });

  const events = (EVENT_TYPES.reduce((acc, event) => {
    acc[event] = {
      id: event,
      name: i18n.t(`constants.content-types.${event}`),
      children: []
    };
    return acc;
  }, {}));

  events[CT_CONGRESS].children = Object.keys(countries);
  // TODO: (yaniv): CT_HOLIDAY data is missing

  return ({
    ...state,
    eventsFilterTree: {
      roots,
      byIds: {
        ALL_EVENTS: {
          id: ALL_EVENTS,
          name: i18n.t('lessons.ALL_EVENTS'),
          children: events[CT_CONGRESS].children
        },
        ...events,
        ...countries,
        ...cities
      }
    }
  });
};

const onFetchAllEventsFailure = state => ({
  ...state,
  eventsFilterTree: {
    ...initialState.eventsFilterTree
  }
});

const onSetPage = (state, action) => (
  {
    ...state,
    pageNo: action.payload
  }
);

const onSetLanguage = state => (
  {
    ...state,
    items: [],
  }
);

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_ALL_EVENTS_SUCCESS]: onFetchAllEventsSuccess,
  [FETCH_ALL_EVENTS_FAILURE]: onFetchAllEventsFailure,
  [FETCH_LIST]: setStatus,
  [FETCH_LIST_SUCCESS]: onFetchListSuccess,
  [FETCH_LIST_FAILURE]: setStatus,
  [FETCH_EVENT_ITEM]: setStatus,
  [FETCH_EVENT_ITEM_SUCCESS]: setStatus,
  [FETCH_EVENT_ITEM_FAILURE]: setStatus,
  [FETCH_FULL_EVENT]: setStatus,
  [FETCH_FULL_EVENT_SUCCESS]: setStatus,
  [FETCH_FULL_EVENT_FAILURE]: setStatus,

  [SET_PAGE]: onSetPage,
}, initialState);

/* Selectors */

const getTotal  = state => state.total;
const getItems  = state => state.items;
const getPageNo = state => state.pageNo;
const getWip    = state => state.wip;
const getErrors = state => state.errors;

const getEventFilterTree = state => state.eventsFilterTree;

export const selectors = {
  getTotal,
  getItems,
  getPageNo,
  getWip,
  getErrors,
  getEventFilterTree
};
