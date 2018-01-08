import { createAction, handleActions } from 'redux-actions';
import { types as settings } from './settings';

/* Types */

const SET_TAB = 'Events/SET_TAB';

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
  SET_TAB,

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

const setTab = createAction(SET_TAB);

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
  setTab,

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
  tab: null,
  total: 0,
  items: [],
  pageNo: 1,
  wip: {
    collections: false,
    items: {},
    fulls: {}
  },
  errors: {
    collections: null,
    items: {},
    fulls: {}
  },
  eventsFilterTree: {
    byIds: {},
    roots: []
  },
  eventsByType: {},
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
  case FETCH_EVENT_ITEM:
    wip.items = { ...wip.items, [action.payload]: true };
    break;
  case FETCH_FULL_EVENT:
    wip.fulls = { ...wip.fulls, [action.payload]: true };
    break;
  case FETCH_ALL_EVENTS_SUCCESS:
    wip.collections    = false;
    errors.collections = null;
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
    wip.collections    = false;
    errors.collections = action.payload;
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

const onFetchAllEventsSuccess = (state, action) => {
  const eventsByType = action.payload.collections.reduce((acc, val) => {
    const { id, content_type: ct } = val;
    let v                          = acc[ct];
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

const onSetTab = (state, action) => (
  {
    ...state,
    tab: action.payload,
  }
);

const onSetLanguage = state => (
  {
    ...state,
    items: [],
    eventsByType: {},
  }
);

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: onSetLanguage,

  [SET_TAB]: onSetTab,

  [FETCH_ALL_EVENTS]: setStatus,
  [FETCH_ALL_EVENTS_SUCCESS]: (state, action) => setStatus(onFetchAllEventsSuccess(state, action), action),
  [FETCH_ALL_EVENTS_FAILURE]: setStatus,
  [FETCH_EVENT_ITEM]: setStatus,
  [FETCH_EVENT_ITEM_SUCCESS]: setStatus,
  [FETCH_EVENT_ITEM_FAILURE]: setStatus,
  [FETCH_FULL_EVENT]: setStatus,
  [FETCH_FULL_EVENT_SUCCESS]: setStatus,
  [FETCH_FULL_EVENT_FAILURE]: setStatus,
}, initialState);

/* Selectors */

const getFilteredData = (state, type, filtersState, mdbState) => {
  return state.eventsByType[type];
};

const getTab    = state => state.tab;
const getWip    = state => state.wip;
const getErrors = state => state.errors;

const getEventFilterTree = state => state.eventsFilterTree;

export const selectors = {
  getTab,
  getFilteredData,
  getWip,
  getErrors,
  getEventFilterTree
};
