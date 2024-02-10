import { createSlice } from '@reduxjs/toolkit';
import { ALL_PAGE_NS } from '../../helpers/consts';

import { actions as settingsActions } from './settings';
import { actions as ssrActions } from './ssr';

const initialState = ALL_PAGE_NS.reduce((acc, ns) => ({
  ...acc, [ns]: {
    collectionsFetched: false, wip: false, error: null
  }
}), {});

const preparePageSlice = createSlice({
  name: 'preparePage',
  initialState,

  reducers     : {
    receiveCollections: (state, { payload: { namespace } }) => void (
      state => state[namespace] = { collectionsFetched: true, err: null, wip: false }
    ),
    fetchCollections  : {
      prepare: (namespace, p) => ({ payload: { namespace, ...p } }),
      reducer: () => void ({})
    }
  },
  extraReducers: builder => {
    builder
      .addCase(ssrActions.prepare, state => {
        if (state.err) {
          state.err = state.err.toString();
        }
      })
      .addCase(settingsActions.setContentLanguages, state => {
        for (const ns in state) {
          state[ns].collectionsFetched = false;
        }
      });
  },

  selectors: {
    wasFetchedByNS: (state, ns) => state[ns]?.collectionsFetched
  }
});

export default preparePageSlice.reducer;

export const { actions } = preparePageSlice;

export const types = Object.fromEntries(new Map(
  Object.values(preparePageSlice.actions).map(a => [a.type, a.type])
));

export const selectors = preparePageSlice.getSelectors();
