import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { fetchSimpleMode } from './thunks';

const initialState = {
  items: {
    lessons: [],
    others: [],
  },
  wip: false,
  err: null,
};

const onSimpleModeSuccess    = (state, { payload }) => {
  state.items = {
    lessons: (payload.lessons || []).map(x => x.id),
    others: (payload.others || []).map(x => x.id)
  };
  state.wip   = false;
  state.err   = null;
};
const onSimpleModeFailure    = (state, { error }) => {
  state.items = { lessons: [], others: [], };
  state.wip   = false;
  state.err   = error.message;
};
export const simpleModeSlice = createSlice({
  name: 'simpleMode',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSimpleMode.fulfilled, onSimpleModeSuccess);
    builder.addCase(fetchSimpleMode.rejected, onSimpleModeFailure);
    builder.addCase(HYDRATE, (state, action) => {
      return ({ ...state, ...action.payload.simpleMode });
    });
  }
});

/* Selectors */
const getItems = state => {
  return state.items;
};
const getWip   = state => state.wip;
const getError = state => state.err;

export const selectors = {
  getItems,
  getWip,
  getError,
};
