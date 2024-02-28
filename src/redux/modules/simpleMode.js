import { createSlice } from '@reduxjs/toolkit';

import { actions as settingsActions } from './settings';
import { actions as ssrActions } from './ssr';

const simpleModeSlice = createSlice({
  name: 'simpleMode',
  initialState: {
    items: {
      lessons: [],
      others: []
    },
    wip: false,
    err: null
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
});

export default simpleModeSlice.reducer;
