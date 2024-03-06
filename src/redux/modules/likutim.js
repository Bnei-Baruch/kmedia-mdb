import { createSlice } from '@reduxjs/toolkit';
import { actions as ssrActions } from './ssr';

const likutimSlice = createSlice({
  name        : 'likutim',
  initialState: {
    wip    : false,
    err    : null,
    likutim: []
  },

  reducers     : {
    fetchLikutim       : state => void (state.wip = true),
    fetchLikutimSuccess: (state, { payload }) => {
      state.wip     = false;
      state.err     = null;
      state.likutim = payload.content_units;
    },
    fetchLikutimFailure: (state, { payload }) => {
      state.wip     = false;
      state.err     = payload;
      state.likutim = [];
    }
  },
  extraReducers: builder => {
    builder.addCase(ssrActions.prepare, state => {
      if (state.err) {
        state.err = state.err.toString();
      }
    });
  },

  selectors: {
    getWip    : state => state.wip,
    getError  : state => state.err,
    getLikutim: state => state.likutim
  }
});

export default likutimSlice.reducer;

export const { actions } = likutimSlice;

export const types = Object.fromEntries(new Map(
  Object.values(likutimSlice.actions).map(a => [a.type, a.type])
));

export const selectors = likutimSlice.getSelectors();
