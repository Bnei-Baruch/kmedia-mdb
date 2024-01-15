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
  }
});

export default bookmarkFilterSlice.reducer;

export const { actions } = bookmarkFilterSlice;

export const types = Object.fromEntries(new Map(
  Object.values(bookmarkFilterSlice.actions).map(a => [a.type, a.type])
));

/* Selectors */
const getAll   = state => state;
const getByKey = (state, key) => state[key];

export const selectors = {
  getAll,
  getByKey
};
