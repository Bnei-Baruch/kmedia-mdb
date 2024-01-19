import { createSlice } from '@reduxjs/toolkit';

const imageSlice = createSlice({
  name        : 'image',
  initialState: { bySrc: {} },

  reducers: {
    fetch       : {
      prepare: (src, fallbacks) => ({ payload: { src, fallbacks } }),
      reducer: (state, { payload: { src, fallbacks = ['default'] } }) => {
        state.bySrc[src] ||= {};
        state.bySrc[src].fallbacks = fallbacks;
        state.bySrc[src].err       = false;
      }
    },
    fetchSuccess: (state, { payload: { src, img } }) => {
      state.bySrc[src] ||= {};
      state.bySrc[src] = { wip: false, err: false, src: img };
    },
    fetchFailure: (state, { payload: { src, err } }) => {
      state.bySrc[src] ||= {};
      state.bySrc[src] = { wip: false, err, src: state.bySrc[src].fallbacks[0] };
    },

    startWIP: (state, { payload: src }) => {
      state.bySrc[src] ||= {};
      state.bySrc[src].wip = true;
    }
  }
});

export default imageSlice.reducer;

export const { actions } = imageSlice;

export const types = Object.fromEntries(new Map(
  Object.values(imageSlice.actions).map(a => [a.type, a.type])
));

/* Selectors */
const getBySrc = (state, src) => state.bySrc[src] || false;

export const selectors = { getBySrc };
