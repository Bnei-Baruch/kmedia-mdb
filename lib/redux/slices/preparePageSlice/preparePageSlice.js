import { ALL_PAGE_NS } from '../../../../src/helpers/consts';
import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { fetchPreparePage } from './thunks';

/* Reducer */
const initialState = ALL_PAGE_NS.reduce((acc, ns) => ({
  ...acc, [ns]: {
    collectionsFetched: false, wip: false, error: null
  }
}), {});

const receiveCollections      = (draft, { payload }) => {
  draft[payload.namespace] = { collectionsFetched: true, err: null, wip: false };
  return draft;
};
export const preparePageSlice = createSlice({
  name: 'preparePage',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload.lists, };
    });

    builder.addCase(fetchPreparePage.fulfilled, receiveCollections);
  }
});

/* Selectors */

const wasFetchedByNS = (state, ns) => state[ns]?.collectionsFetched;

export const selectors = {
  wasFetchedByNS,
};
