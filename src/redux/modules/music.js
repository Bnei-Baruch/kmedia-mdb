import { createSlice } from '@reduxjs/toolkit';
import { actions as settingsActions } from './settings';
import { actions as ssrActions } from './ssr';

const musicSlice = createSlice({
  name        : 'music',
  initialState: {
    wip    : false,
    err    : null,
    likutim: []
  },

  reducers     : {
    fetchMusic       : state => void (state.wip = true),
    fetchMusicSuccess: (state, { payload }) => {
      state.wip       = false;
      state.err       = null;
      state.musicData = payload || [];
    },
    fetchMusicFailure: (state, { payload }) => {
      state.wip = false;
      state.err = payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(ssrActions.prepare, state => {
      if (state.err) {
        state.err = state.err.toString();
      }
    }).addCase(settingsActions.setContentLanguages, status => void (status.musicData = []));
  }
});

export default musicSlice.reducer;

export const { actions } = musicSlice;

export const types = Object.fromEntries(new Map(
  Object.values(musicSlice.actions).map(a => [a.type, a.type])
));

/* Selectors */

const getWip       = state => state.wip;
const getError     = state => state.err;
const getMusicData = state => state.musicData;

export const selectors = {
  getWip,
  getError,
  getMusicData
};
