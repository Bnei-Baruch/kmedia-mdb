import { createAction } from 'redux-actions';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';

import { isEmpty } from '../../helpers/utils';
import { handleActions, types as settings } from './settings';
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
  wip: false,
  err: null,
  eventsByType: {},
};

const onSuccess = (draft, payload) => {
  draft.wip          = false;
  draft.err          = null;
  draft.eventsByType = mapValues(groupBy(payload.collections, x => x.content_type), x => x.map(y => y.id));
};

const onSetLanguage = draft => {
  draft.eventsByType = {};
};

const onFailure = (draft, payload) => {
  draft.wip = false;
  draft.err = payload;
};

const onSSRPrepare = draft => {
  if (draft.err) {
    draft.err = draft.err.toString();
  }
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_ALL_EVENTS]: draft => {
    draft.wip = true;
  },
  [FETCH_ALL_EVENTS_SUCCESS]: onSuccess,
  [FETCH_ALL_EVENTS_FAILURE]: onFailure,
}, initialState);

/* Selectors */

const makeYearsPredicate = values => x => isEmpty(values)
  || values.some(v => x.start_date.substring(0, 4) <= v && v <= x.end_date.substring(0, 4)
  );

const makeLocationsPredicate = values => x => isEmpty(values)
  || values.some((v) => {
    const [country, city] = v;
    return country === x.country && (!city || city === x.city);
  });

const makeHolidaysPredicate = values => x => isEmpty(values)
  || values.some(v => x.holiday_id === v[0]);

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

const getWip          = state => state.wip;
const getError        = state => state.err;
const getEventsByType = state => state.eventsByType;

export const selectors = {
  getWip,
  getError,
  getEventsByType,
  getFilteredData,
};
