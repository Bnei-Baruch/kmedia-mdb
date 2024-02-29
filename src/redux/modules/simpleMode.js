import { createSlice } from '@reduxjs/toolkit';

import { actions as settingsActions } from './settings';
import { actions as ssrActions } from './ssr';

const simpleModeSlice = createSlice({
  name        : 'simpleMode',
  initialState: {
    items: {
      lessons: [],
      others : []
    },
    wip  : false,
    err  : null
  },

  reducers     : {
    fetchForDate       : state => {
      state.wip = true;
      state.err = null;
    },
    fetchForDateSuccess: (state, { payload }) => {
      state.items         = {};
      state.items.lessons = (payload.lessons || []).map(x => x.id);
      state.items.others  = (payload.others || []).map(x => x.id);
      state.wip           = false;
      state.err           = null;
    },
    fetchForDateFailure: (state, { payload }) => {
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
      .addCase(settingsActions.setContentLanguages, state => {
        state.items.lessons = [];
        state.items.others  = [];
      })
      .addCase(settingsActions.setUILanguage, state => {
        state.items.lessons = [];
        state.items.others  = [];
      });
  },

  selectors: {
    getItems: state => state.items,
    getWip  : state => state.wip,
    getError: state => state.err
  }
});

export default simpleModeSlice.reducer;

export const { actions } = simpleModeSlice;

export const types = Object.fromEntries(new Map(
  Object.values(simpleModeSlice.actions).map(a => [a.type, a.type])
));

export const selectors = simpleModeSlice.getSelectors();
