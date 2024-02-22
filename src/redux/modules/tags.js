import { createSlice } from '@reduxjs/toolkit';

import { tracePath, buildById } from '../../helpers/utils';
import { TOPICS_FOR_DISPLAY } from '../../helpers/consts';
import { actions as settings } from './settings';
import { actions as ssrActions } from './ssr';

const onReceiveTags = (state, { payload }) => {
  state.byId         = buildById(payload);
  state.roots        = payload.map(x => x.id);
  state.displayRoots = state.roots.filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1);
  state.loaded       = true;
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState: {
    wip: false,
    error: null,
    dashboard: { items: [], mediaTotal: 0, textTotal: 0 },
    loaded: false,
    byId: {}
  },

  reducers: {
    receiveTags: onReceiveTags,

    fetchDashboard: state => void (state.wip = true),
    fetchDashboardSuccess: (state, { payload: { items = [], mediaTotal, textTotal } }) => {
      state.wip       = false;
      state.error     = null;
      state.dashboard = { items, mediaTotal, textTotal };
    },
    fetchDashboardFailure: {
      prepare: (id, err) => ({ payload: { id, err } }),
      reducer: (state, { payload: { id, err } }) => {
        state.wip   = false;
        state.error = err;
      }
    },

    fetchStats: {
      prepare: (namespace, contentTypes) => ({ payload: { namespace, contentTypes } }),
      reducer: () => void ({})
    },
    fetchStatsSuccess: () => void ({}),
    fetchStatsFailure: () => void ({})
  },
  extraReducers: builder => {
    builder
      .addCase(ssrActions.prepare, state => {
        state.wip       = false;
        state.loaded    = false;
        state.dashboard = { items: [], mediaTotal: 0, textTotal: 0 };

        if (state.error) {
          state.error = state.error.toString();
        }
      })
      .addCase(settings.setUILanguage, state => {
        state.loaded = false;
        state.wip    = false;
        state.err    = null;
      });
  }
});

export default tagsSlice.reducer;

export const { actions } = tagsSlice;

export const types = Object.fromEntries(new Map(
  Object.values(tagsSlice.actions).map(a => [a.type, a.type])
));

/* Selectors */

const areTagsLoaded   = state => state.loaded;
const getTags         = state => state.byId;
const getRoots        = state => state.roots;
const getDisplayRoots = state => state.displayRoots;
const getTagById      = state => id => state?.byId[id];
const getPath         = state => source => tracePath(source, getTagById(state));
const getPathByID     = state => {
  const _byId = getTagById(state);
  return id => tracePath(_byId(id), _byId);
};

const getWip   = state => state.wip;
const getError = state => state.error;

const getItems = state => state.dashboard || {};

export const selectors = {
  areTagsLoaded,
  getWip,
  getError,
  getTags,
  getRoots,
  getDisplayRoots,
  getTagById,
  getPath,
  getPathByID,
  getItems
};

