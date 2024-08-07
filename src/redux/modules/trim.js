import { createSlice } from '@reduxjs/toolkit';

const trimSlice = createSlice({
  name        : 'trim',
  initialState: {
    list  : [],
    wips  : [],
    errors: []
  },

  reducers: {
    trim       : state => void (state.wips.push(state.wips.length)),
    trimSuccess: (state, { payload: { download, link } }) => {
      state.list.push({ download, link, name: link.split('/').slice(-1)[0] });
      state.wips.pop();
    },
    trimFailure: (state, { payload }) => {
      state.errors.push(payload);
      state.wips.pop();
    }
  },

  selectors: {
    getList  : state => state.list,
    getWIPs  : state => state.wips,
    getErrors: state => state.errors
  }
});

export default trimSlice.reducer;

export const { actions } = trimSlice;

export const types = Object.fromEntries(new Map(
  Object.values(trimSlice.actions).map(a => [a.type, a.type])
));

export const selectors = trimSlice.getSelectors();
