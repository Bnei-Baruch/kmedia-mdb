import { createSlice } from '@reduxjs/toolkit';
import { fetchList, fetchSectionList } from '@/lib/redux/slices/listSlice/thunks';
import { HYDRATE } from 'next-redux-wrapper';

/* Reducer */
const defaultNSvalue = { pageNo: 1, total: 0 };

const onSetPage = (draft, { namespace, pageNo }) => {
  if (draft[namespace] === undefined) {
    draft[namespace] = { ...defaultNSvalue };
  }

  draft[namespace].pageNo = pageNo;
};

const onRequest = (draft, { namespace }) => {
  if (draft[namespace] === undefined) {
    draft[namespace] = { ...defaultNSvalue };
  }

  draft[namespace].wip = true;
};

const onFailure = (draft, action) => {
  const { error, meta: { arg } } = action;
  if (draft[arg.namespace] === undefined) {
    draft[arg.namespace] = { ...defaultNSvalue };
  }

  draft[arg.namespace].wip = false;
  draft[arg.namespace].err = error.message;
};

const onSuccess = (draft, action) => {
  const { namespace, data } = action.payload;
  if (draft[namespace] === undefined) {
    draft[namespace] = { ...defaultNSvalue };
  }

  draft[namespace].wip   = false;
  draft[namespace].err   = null;
  draft[namespace].total = data.total;
  draft[namespace].items = (data.collections || data.content_units || []).map(x => x.id);
};

const onSectionSuccess = (state, action) => {
  const { namespace, total, items } = action.payload;
  if (state[namespace] === undefined) {
    state[namespace] = { ...defaultNSvalue };
  }

  state[namespace] = { ...state[namespace], wip: false, err: null, total, items };
};

export const listSlice = createSlice({
  name: 'lists',
  initialState: {},
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: { setPage: onSetPage, fetchList: onRequest, fetchSectionList: onRequest },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload.lists, };
    });
    builder.addCase(fetchList.fulfilled, onSuccess);
    builder.addCase(fetchList.rejected, onFailure);
    builder.addCase(fetchSectionList.fulfilled, onSectionSuccess);
    builder.addCase(fetchSectionList.rejected, onFailure);
  }
});

/* Selectors */

const getNamespaceState = (state, namespace) => state[namespace] || defaultNSvalue;

export const selectors = {
  getNamespaceState,
};
