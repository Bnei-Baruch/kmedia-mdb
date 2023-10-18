import { createSlice } from '@reduxjs/toolkit';
import { trim } from './thunks';

/* Reducer */

const initialState = {
  list: [],
  wips: [],
  errors: []
};

const onTrim = draft => {
  draft.wips.push(draft.wips.length);
  return draft;
};

const onTrimSuccess = (draft, { payload }) => {
  const { download, link } = payload;
  draft.list.push({ download, link, name: link.split('/').slice(-1)[0] });
  draft.wips.pop();
  return draft;
};

const onTrimFailure = (draft, { error }) => {
  draft.errors.push(error.message);
  draft.wips.pop();
  return draft;
};

export const trimSlice = createSlice({
  name: 'trim',
  initialState,
  reducers: { trim: onTrim },
  extraReducers: (builder) => {
    builder.addCase(trim.fulfilled, onTrimSuccess);
    builder.addCase(trim.rejected, onTrimFailure);
  }
});

/* Selectors */
const getList   = state => state.list;
const getWIPs   = state => state.wips;
const getErrors = state => state.errors;

export const selectors = {
  getList,
  getWIPs,
  getErrors,
};
