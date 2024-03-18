import { createSlice } from '@reduxjs/toolkit';

import { actions as settingsActions } from './settings';
import { backendApi } from '../api/backendApi';
import { wholeSimpleMode } from '../api/simpleMode';

const invalidateSimpleMode = state => state.dispatch(backendApi.util.invalidateTags(wholeSimpleMode));

const simpleModeSlice = createSlice({
  name        : 'simpleMode',
  initialState: {},

  extraReducers: builder => {
    builder
      .addCase(settingsActions.setContentLanguages, invalidateSimpleMode)
      .addCase(settingsActions.setUILanguage, invalidateSimpleMode);
  },
});

export default simpleModeSlice.reducer;
