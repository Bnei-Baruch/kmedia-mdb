import { createSlice } from '@reduxjs/toolkit';

const bookmarkFilterSlice = createSlice({
  name        : 'bookmarkFilter',
  initialState: { test: 'yes' },

  reducers: {
    addFilter   : {
      prepare: (key, value) => ({ payload: { key, value } }),
      reducer: (state, { payload: { key, value } }) => void (state[key] = value)
    },
    deleteFilter: (state, { payload: { key } }) => void (state[key] = null)
  },

  selectors: {
    getAll  : state => state,
    getByKey: (state, key) => state[key]
  }
});

export default bookmarkFilterSlice.reducer;

export const { actions } = bookmarkFilterSlice;

export const types = Object.fromEntries(new Map(
  Object.values(bookmarkFilterSlice.actions).map(a => [a.type, a.type])
));

export const selectors = bookmarkFilterSlice.getSelectors();
