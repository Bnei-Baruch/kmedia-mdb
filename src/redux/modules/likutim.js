import { actions as ssrActions } from './ssr';

import { createSlice } from '@reduxjs/toolkit';

const likutimSlice = createSlice({
  name: 'likutim',
  initialState: {
    wip: false,
    err: null,
    byKey: {}
  },

  reducers: {
    fetchByTag: (state, { payload: { payload: { key } } }) => {
      state.err[key] = null;
      state.wip[key] = true;
    },

    fetchByTagSuccess: (state, { payload }) => {
      const { content_units, key } = payload;
      for (const cu of content_units) {
        cu.tags.forEach(id => {
          if (!key.includes(id)) return;
          const ids = state.byKey[key] ? state.byKey[key] : [];
          if (ids.includes(cu.id)) return;
          state.byKey[key] = [...ids, cu.id];
        });
      }

      console.log('likutim onByKeySuccess', key);
      state.wip[key] = false;
    },
    fetchByTagFailure: (state, { payload }) => {
      const { err, key } = payload;
      state.err[key]     = err;
      state.wip[key]     = false;
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
    getWip: (state, key) => state.wip[key],
    getError: (state, key) => state.err[key],
    getByTag: state => key => state.byKey[key]
  }
});

export default likutimSlice.reducer;

export const { actions } = likutimSlice;

export const types = Object.fromEntries(new Map(
  Object.values(likutimSlice.actions).map(a => [a.type, a.type])
));

export const selectors = likutimSlice.getSelectors();
