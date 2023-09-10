import { createSlice } from '@reduxjs/toolkit';
import { fetchTags } from '../tagsSlice';
import { imageFetch } from './thunks';

/* Reducer */

const initialState = { bySrc: {}, };

const onFetchSuccess = (draft, { payload }) => {
  const { src, img } = payload;
  draft.bySrc[src] = { wip: false, err: false, src: img };
};
const onFetchFailure = (draft, { meta, error }) => {
  draft.bySrc[meta.arg] = { wip: false, err: error.message, src: 'default' };
};
const onStartWIP     = (draft, src) => {
  draft.bySrc[src] = { wip: true };
};

export const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    startWIP: onStartWIP
  },
  extraReducers: (builder) => {
    builder.addCase(imageFetch.fulfilled, onFetchSuccess);
    //builder.addCase(imageFetch.pending, onFetchPending);
    builder.addCase(imageFetch.rejected, onFetchFailure);
  }
});
/* Selectors */
const getBySrc = (state, src) => {
  return state.bySrc[src] || false;
};

export const selectors = { getBySrc };
