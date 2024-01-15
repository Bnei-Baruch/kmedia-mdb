import { createSlice } from '@reduxjs/toolkit';
import mapValues from 'lodash/mapValues';

import { actions as settingsAction } from './settings';
import { actions as ssrActions } from './ssr';

const onSSRPrepare = state => mapValues(state, x => ({ ...x, err: x.err ? x.err.toString() : x.err }));

const onSetLanguage = state => (
  Object.keys(state).reduce((acc, val) => {
    acc[val] = {
      pageNo: state[val].pageNo,
      total : state[val].total
    };
    return acc;
  }, {})
);

const defaultNSvalue = { pageNo: 1, total: 0 };

const listsSlice = createSlice({
  name        : 'lists',
  initialState: {},

  reducers     : {
    setPage: {
      prepare: (namespace, pageNo) => ({ payload: { namespace, pageNo } }),
      reducer: (state, { payload: { namespace, pageNo } }) => {
        state[namespace] ||= { ...defaultNSvalue };
        state[namespace].pageNo = pageNo;
      }
    },

    fetchList       : {
      prepare: (namespace, pageNo, params = {}) => ({ payload: { namespace, pageNo, ...params } }),
      reducer: (state, { payload: { namespace } }) => {
        state[namespace] ||= { ...defaultNSvalue };
        state[namespace].wip = true;
      }
    },
    fetchListFailure: {
      prepare: (namespace, err) => ({ payload: { namespace, err } }),
      reducer: (state, { payload: { namespace, err } }) => {
        state[namespace] ||= { ...defaultNSvalue };
        state[namespace].wip = false;
        state[namespace].err = err;
      }
    },
    fetchListSuccess: {
      prepare: (namespace, data) => ({ payload: { namespace, data } }),
      reducer: (state, { payload: { namespace, data } }) => {
        state[namespace] ||= { ...defaultNSvalue };
        state[namespace].wip   = false;
        state[namespace].err   = null;
        state[namespace].total = data.total;
        state[namespace].items = (data.collections || data.content_units || []).map(x => x.id);
      }
    },

    fetchSectionList       : {
      prepare: (namespace, pageNo, params = {}) => ({ payload: { namespace, pageNo, ...params } }),
      reducer: (state, { payload: { namespace } }) => {
        state[namespace] ||= { ...defaultNSvalue };
        state[namespace].wip = true;
      }
    },
    fetchSectionListSuccess: {
      prepare: (namespace, data) => ({ payload: { namespace, data } }),
      reducer: (state, { payload: { namespace, data: { total, items } } }) => {
        state[namespace] ||= { ...defaultNSvalue };
        state[namespace].wip   = false;
        state[namespace].err   = null;
        state[namespace].total = total;
        state[namespace].items = items;
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(ssrActions.prepare, onSSRPrepare)
      .addCase(settingsAction.setContentLanguages, onSetLanguage);
  }
});

export default listsSlice.reducer;

export const { actions } = listsSlice;

export const types = Object.fromEntries(new Map(
  Object.values(listsSlice.actions).map(a => [a.type, a.type])
));

/* Selectors */

const getNamespaceState = (state, namespace) => state[namespace] || defaultNSvalue;

export const selectors = {
  getNamespaceState
};
