import { createSlice } from '@reduxjs/toolkit';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';

import { isEmpty } from '../../helpers/utils';
import { actions as settingsActions } from './settings';
import { actions as ssrActions } from './ssr';
import { selectors as mdb } from './mdb';

const eventsSlice = createSlice({
  name        : 'events',
  initialState: {
    wip         : false,
    err         : null,
    eventsByType: {}
  },

  reducers     : {
    setTab: () => ({}),

    fetchAllEvents       : state => void (state.wip = true),
    fetchAllEventsSuccess: (state, { payload }) => {
      state.wip          = false;
      state.err          = null;
      state.eventsByType = mapValues(groupBy(payload.collections, x => x.content_type), x => x.map(y => y.id));
    },
    fetchAllEventsFailure: (state, { payload }) => {
      state.wip = false;
      state.err = payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(ssrActions.prepare, state => {
        if (state.err) {
          state.err = state.err.toString();
        }
      })
      .addCase(settingsActions.setContentLanguages, state => void (state.eventsByType = {}));
  }
});

export default eventsSlice.reducer;

export const { actions } = eventsSlice;

export const types = Object.fromEntries(new Map(
  Object.values(eventsSlice.actions).map(a => [a.type, a.type])
));

/* Selectors */

const makeYearsPredicate = values => x => isEmpty(values)
  || values.some(v => x.start_date.substring(0, 4) <= v && v <= x.end_date.substring(0, 4)
  );

const makeLocationsPredicate = values => x => isEmpty(values)
  || values.some(v => {
    const [country, city] = v;
    return country === x.country && (!city || city === x.city);
  });

const makeHolidaysPredicate = values => x => isEmpty(values)
  || values.some(v => x.holiday_id === v[0]);

const predicateMap = {
  'years-filter'    : makeYearsPredicate,
  'locations-filter': makeLocationsPredicate,
  'holidays-filter' : makeHolidaysPredicate
};

const getFilteredData = (state, type, filtersState, mdbState) => {
  const predicates = filtersState.map(x => predicateMap[x.name](x.values)) || [];

  return (state.eventsByType[type] || []).filter(x => {
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
  getFilteredData
};
