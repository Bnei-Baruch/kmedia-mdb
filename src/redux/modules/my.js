import { createSlice } from '@reduxjs/toolkit';

import { MY_NAMESPACE_PLAYLISTS, MY_NAMESPACE_REACTIONS, MY_NAMESPACES } from '../../helpers/consts';
import { getMyItemKey } from '../../helpers/my';

const newNamespace      = {
  keys   : [],
  byKey  : {},
  total  : 0,
  wip    : false,
  errors : null,
  pageNo : 0,
  deleted: false
};
const initialNamespaces = MY_NAMESPACES.reduce((acc, n) => {
  acc[n] = { ...newNamespace };
  return acc;
}, {});

const onFetch = (state, { namespace, addToList = true }) => {
  if (!state[namespace]) state[namespace] = { ...newNamespace };

  addToList && (state[namespace].total = 0);
  state[namespace].wip     = true;
  state[namespace].errors  = false;
  state[namespace].fetched = false;
};

const onFetchSuccess = (state, { namespace, addToList = true, items, total }) => {
  state[namespace].total   = total;
  state[namespace].wip     = false;
  state[namespace].errors  = false;
  state[namespace].fetched = true;

  const keys = addToList ? [] : state[namespace].keys;
  Object.values(items).forEach(x => {
    const { key } = getMyItemKey(namespace, x);
    addToList && keys.push(key);
    state[namespace].byKey[key] = x;
  });

  state[namespace].keys = keys;
};

const onFetchFailure = (state, { namespace }) => {
  state[namespace].wip     = false;
  state[namespace].errors  = true;
  state[namespace].fetched = true;
};

const onFetchOne = (state, { namespace }) => {
  state[namespace].wip    = true;
  state[namespace].errors = false;
};

const onFetchOneSuccess = (state, { namespace, item }) => {
  const { key }               = getMyItemKey(namespace, item);
  state[namespace].byKey[key] = item;

  state[namespace].wip    = false;
  state[namespace].errors = false;
};

const onAddSuccess = (state, { namespace, item }) => {
  const { key }               = getMyItemKey(namespace, item);
  state[namespace].byKey[key] = item;
  state[namespace].keys       = [key, ...state[namespace].keys];
  state[namespace].total      = state[namespace].total + 1;
  state[namespace].wip        = false;
  state[namespace].errors     = false;
  if (namespace === MY_NAMESPACE_REACTIONS) {
    state.reactionsCount[key] = state.reactionsCount[key] ? state.reactionsCount[key] + 1 : 1;
  }
};

const onEditSuccess = (state, { namespace, item, changeItems }) => {
  const { key } = getMyItemKey(namespace, item);
  const byKey   = { ...state[namespace].byKey[key], ...item };
  if (namespace === MY_NAMESPACE_PLAYLISTS && !changeItems) {
    byKey.total_items = state[namespace].byKey[key].total_items;
    byKey.items       = state[namespace].byKey[key].items;
  }

  state[namespace].byKey[key] = byKey;

  state[namespace].wip    = false;
  state[namespace].errors = false;
};

const onRemoveSuccess = (state, { namespace, key }) => {
  state[namespace].keys       = state[namespace].keys.filter(k => k !== key);
  state[namespace].byKey[key] = null;
  state[namespace].deleted    = true;
  state[namespace].total      = state[namespace].total - 1;
  state[namespace].wip        = false;
  state[namespace].errors     = false;
  if (namespace === MY_NAMESPACE_REACTIONS) {
    state.reactionsCount[key] = state.reactionsCount[key] ? state.reactionsCount[key] - 1 : 0;
  }
};

const onSetDeleted = (state, { namespace, deleted }) => {
  state[namespace].deleted = deleted;
};

const onReactionsCountSuccess = (state, data) => {
  if (Array.isArray(data)) {
    data.reduce((acc, x) => {
      const { key } = getMyItemKey(MY_NAMESPACE_REACTIONS, x);
      acc[key]      = x.total;
      return acc;
    }, state.reactionsCount);
  }
};

const mySlice = createSlice({
  name        : 'my',
  initialState: {
    reactionsCount: {},
    ...initialNamespaces
  },

  reducers: {
    setPage: {
      prepare: (namespace, pageNo) => ({ payload: { namespace, pageNo } }),
      reducer: (state, { payload: { namespace, pageNo } }) => void (state[namespace].pageNo = pageNo)
    },

    fetch       : {
      prepare: (namespace, params) => ({ payload: { namespace, ...params } }),
      reducer: (state, { payload }) => void (onFetch(state, payload))
    },
    fetchSuccess: (state, { payload }) => void (onFetchSuccess(state, payload)),
    fetchFailure: (state, { payload }) => void (onFetchFailure(state, payload)),

    fetchOne       : {
      prepare: (namespace, params) => ({ payload: { namespace, ...params } }),
      reducer: (state, { payload }) => void (onFetchOne(state, payload))
    },
    fetchOneSuccess: (state, { payload }) => void (onFetchOneSuccess(state, payload)),

    add          : {
      prepare: (namespace, params) => ({ payload: { namespace, ...params } }),
      reducer: () => void ({})
    },
    addSuccess   : (state, { payload }) => void (onAddSuccess(state, payload)),
    edit         : {
      prepare: (namespace, params) => ({ payload: { namespace, ...params } }),
      reducer: () => void ({})
    },
    editSuccess  : (state, { payload }) => void (onEditSuccess(state, payload)),
    remove       : {
      prepare: (namespace, params) => ({ payload: { namespace, ...params } }),
      reducer: () => void ({})
    },
    removeSuccess: (state, { payload }) => void (onRemoveSuccess(state, payload)),

    setDeleted: {
      prepare: (namespace, deleted) => ({ payload: { namespace, deleted } }),
      reducer: (state, { payload }) => void (onSetDeleted(state, payload))
    },

    reactionsCount       : () => void ({}),
    reactionsCountSuccess: (state, { payload }) => void (onReactionsCountSuccess(state, payload))
  }
});

export default mySlice.reducer;

export const { actions } = mySlice;

export const types = Object.fromEntries(new Map(
  Object.values(mySlice.actions).map(a => [a.type, a.type])
));

/* Selectors */
const getList      = (state, namespace) => state[namespace]?.keys.map(key => getItemByKey(state, namespace, key));
const getItemByKey = (state, namespace, key) => state[namespace].byKey[key];

const getWIP            = (state, namespace) => state[namespace]?.wip || false;
const getErr            = (state, namespace) => state[namespace]?.errors || null;
const getInfo           = (state, namespace) => (
  {
    err    : state[namespace]?.errors || null,
    wip    : state[namespace]?.wip || false,
    fetched: state[namespace]?.fetched || false
  }
);
const getDeleted        = (state, namespace) => state[namespace].deleted;
const getPageNo         = (state, namespace) => state[namespace].pageNo;
const getTotal          = (state, namespace) => state[namespace].total;
const getReactionsCount = (state, key) => state.reactionsCount[key];

export const selectors = {
  getList,
  getItemByKey,
  getWIP,
  getErr,
  getInfo,
  getDeleted,
  getPageNo,
  getTotal,
  getReactionsCount
};
