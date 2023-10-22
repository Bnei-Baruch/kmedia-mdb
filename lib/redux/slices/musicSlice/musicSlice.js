import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { fetchMusic } from './thunks';

const initialState = {
  wip: false,
  err: null,
  musicData: [],
};

const onSuccess = (state, { payload }) => {
  state.wip       = false;
  state.err       = null;
  state.musicData = payload || [];
};

const onFailure = (state, { error }) => {
  state.wip = false;
  state.err = error.message;
};

export const musicSlice = createSlice({
  name: 'music',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload.music };
    });
    builder.addCase(fetchMusic.fulfilled, onSuccess);
    builder.addCase(fetchMusic.rejected, onFailure);
  }
});

/* Selectors */

const getWip       = state => state.wip;
const getError     = state => state.err;
const getMusicData = state => state.musicData;

export const selectors = {
  getWip,
  getError,
  getMusicData,
};
