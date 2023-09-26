import { MY_NAMESPACE_PLAYLISTS, MY_NAMESPACE_REACTIONS, MY_NAMESPACES } from '@/src/helpers/consts';
import { getMyItemKey } from '@/src/helpers/my';
import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { fetchMy, addMy, removeMy, editMy, reactionsCount, fetchOne } from '@/lib/redux/slices/mySlice/thunks';

/* Reducer */
const newNamespace      = {
  keys: [],
  byKey: {},
  total: 0,
  wip: false,
  errors: null,
  pageNo: 0,
  deleted: false
};
const initialNamespaces = MY_NAMESPACES.reduce((acc, n) => {
  acc[n] = { ...newNamespace };
  return acc;
}, {});

const onSetPage = (draft, { namespace, pageNo }) => draft[namespace].pageNo = pageNo;

const onFetch = (draft, { namespace, addToList = true }) => {
  if (!draft[namespace]) draft[namespace] = { ...newNamespace };

  addToList && (draft[namespace].total = 0);
  draft[namespace].wip     = true;
  draft[namespace].errors  = false;
  draft[namespace].fetched = false;
  return draft;
};

const onFetchSuccess = (draft, action) => {
  const { namespace, addToList = true, items, total } = action.payload;

  if (!draft[namespace]) draft[namespace] = { ...newNamespace };
  draft[namespace].total   = total ?? 0;
  draft[namespace].wip     = false;
  draft[namespace].errors  = false;
  draft[namespace].fetched = true;

  const keys = addToList ? [] : draft[namespace].keys;
  Object.values(items).forEach(x => {
    const { key } = getMyItemKey(namespace, x);
    addToList && keys.push(key);
    draft[namespace].byKey[key] = x;
  });

  draft[namespace].keys = keys;
};

const onFetchFailure = (draft, { namespace }) => {
  draft[namespace].wip     = false;
  draft[namespace].errors  = true;
  draft[namespace].fetched = true;
  return draft;
};

const onFetchOne = (draft, { namespace }) => {
  draft[namespace].wip    = true;
  draft[namespace].errors = false;
  return draft;
};

const onFetchOneSuccess = (draft, { namespace, item }) => {
  const { key }               = getMyItemKey(namespace, item);
  draft[namespace].byKey[key] = item;

  draft[namespace].wip    = false;
  draft[namespace].errors = false;
  return draft;
};

const onAddSuccess = (draft, { namespace, item }) => {
  const { key }               = getMyItemKey(namespace, item);
  draft[namespace].byKey[key] = item;
  draft[namespace].keys       = [key, ...draft[namespace].keys];
  draft[namespace].total      = draft[namespace].total + 1;
  if (namespace === MY_NAMESPACE_REACTIONS)
    draft.reactionsCount[key] = draft.reactionsCount[key] ? draft.reactionsCount[key] + 1 : 1;

  draft[namespace].wip    = false;
  draft[namespace].errors = false;

  return draft;
};

const onEditSuccess = (draft, { namespace, item, changeItems }) => {
  const { key } = getMyItemKey(namespace, item);
  const byKey   = { ...draft[namespace].byKey[key], ...item };
  if (namespace === MY_NAMESPACE_PLAYLISTS && !changeItems) {
    byKey.total_items = draft[namespace].byKey[key].total_items;
    byKey.items       = draft[namespace].byKey[key].items;
  }

  draft[namespace].byKey[key] = byKey;

  draft[namespace].wip    = false;
  draft[namespace].errors = false;
  return draft;
};

const onRemoveSuccess = (draft, { namespace, key }) => {
  draft[namespace].keys       = draft[namespace].keys.filter(k => k !== key);
  draft[namespace].byKey[key] = null;
  draft[namespace].deleted    = true;
  draft[namespace].total      = draft[namespace].total - 1;
  if (namespace === MY_NAMESPACE_REACTIONS)
    draft.reactionsCount[key] = draft.reactionsCount[key] ? draft.reactionsCount[key] - 1 : 0;

  draft[namespace].wip    = false;
  draft[namespace].errors = false;
  return draft;
};

const onSetDeleted = (draft, { namespace, deleted }) => {
  draft[namespace].deleted = deleted;
  return draft;
};

const onReactionsCountSuccess = (draft, data) => {
  if (Array.isArray(data)) {
    data.reduce((acc, x) => {
      const { key } = getMyItemKey(MY_NAMESPACE_REACTIONS, x);
      acc[key]      = x.total;
      return acc;
    }, draft.reactionsCount);
  }

  return draft;
};

export const mySlice = createSlice({
  name: 'my',
  initialState: { reactionsCount: {}, ...initialNamespaces },
  reducers: {
    setPage: onSetPage, setDeleted: onSetDeleted
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload.my, };
    });
    builder.addCase(fetchMy.fulfilled, onFetchSuccess);
    builder.addCase(fetchMy.rejected, onFetchFailure);

    builder.addCase(fetchOne.fulfilled, onFetchOneSuccess);
    builder.addCase(addMy.fulfilled, onAddSuccess);
    builder.addCase(editMy.fulfilled, onEditSuccess);
    builder.addCase(removeMy.fulfilled, onRemoveSuccess);
    builder.addCase(reactionsCount.fulfilled, onReactionsCountSuccess);
  }
});

/* Selectors */
const getList      = (state, namespace) => state[namespace]?.keys.map(key => getItemByKey(state, namespace, key));
const getItemByKey = (state, namespace, key) => state[namespace].byKey[key];

const getWIP            = (state, namespace) => state[namespace]?.wip || false;
const getErr            = (state, namespace) => state[namespace]?.errors || null;
const getInfo           = (state, namespace) => (
  {
    err: state[namespace]?.errors || null,
    wip: state[namespace]?.wip || false,
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
  getReactionsCount,
};
