import { createSlice } from '@reduxjs/toolkit';

const likutimSlice = createSlice({
  name: 'likutim',
  initialState: {
    wip: {},
    err: {},
    byKey: {}
  },

  reducers: {
    fetchByTag: (state, { payload }) => {
      state.err[payload] = null;
      state.wip[payload] = true;
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

      state.wip[key] = false;
    },
    fetchByTagFailure: (state, { payload }) => {
      const { err, key } = payload;
      state.err[key]     = err;
      state.wip[key]     = false;
    }
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
