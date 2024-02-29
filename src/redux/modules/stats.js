import { createSlice } from '@reduxjs/toolkit';

const statsSlice = createSlice({
  name        : 'stats',
  initialState: {
    cuStats: {}
  },

  reducers: {
    fetchCUStats       : {
      prepare: (namespace, params = {}) => ({ payload: { namespace, ...params } }),
      reducer: (state, { payload: { namespace } }) => {
        state.cuStats[namespace] ||= {};
        state.cuStats[namespace].wip = true;
      }
    },
    fetchCUStatsSuccess: {
      prepare: (namespace, data) => ({ payload: { namespace, data } }),
      reducer: (state, { payload: { namespace, data } }) => {
        state.cuStats[namespace] ||= {};
        state.cuStats[namespace].wip  = false;
        state.cuStats[namespace].data = data;
      }
    },
    fetchCUStatsFailure: {
      prepare: (namespace, err) => ({ payload: { namespace, err } }),
      reducer: (state, { payload: { namespace, err } }) => {
        state.cuStats[namespace] ||= {};
        state.cuStats[namespace].wip = false;
        state.cuStats[namespace].err = err;
      }
    },
    clearCUStats       : (state, { payload: { namespace } }) => void (state.cuStats[namespace] ||= {})
  },

  selectors: {
    getCUStats: (state, namespace) => state.cuStats[namespace] || {}
  }
});

export default statsSlice.reducer;

export const { actions } = statsSlice;

export const types = Object.fromEntries(new Map(
  Object.values(statsSlice.actions).map(a => [a.type, a.type])
));

export const selectors = statsSlice.getSelectors();
