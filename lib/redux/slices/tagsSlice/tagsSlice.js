import { tracePath } from '@/src/helpers/utils';
import { TOPICS_FOR_DISPLAY } from '@/src/helpers/consts';
import { createSlice } from '@reduxjs/toolkit';
import { fetchTags } from '@/lib/redux/slices/tagsSlice/thunks';
import { HYDRATE } from 'next-redux-wrapper';

/* Reducer */

const initialState = {
  wip: false,
  error: null,
  dashboard: { items: [], mediaTotal: 0, textTotal: 0 },
  loaded: false,
};

const buildById = items => {
  const byId = {};

  // We BFS the tree, extracting each item by it's ID
  // and normalizing it's children
  let s = [...items];
  while (s.length > 0) {
    const node = s.pop();
    if (node.children) {
      s = s.concat(node.children);
    }

    byId[node.id] = {
      ...node,
      children: node.children ? node.children.map(x => x.id) : [],
    };
  }

  return byId;
};

const onReceiveTags = (draft, action) => {
  const { payload } = action;
  const byId        = buildById(payload);

  const roots        = payload.map(x => x.id);
  const displayRoots = roots.filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1);

  draft.byId         = byId;
  draft.roots        = roots;
  draft.displayRoots = displayRoots;
  draft.loaded       = true;
};

const onDashboard = draft => {
  draft.wip = true;
};

const onDashboardSuccess = (draft, { items = [], mediaTotal, textTotal }) => {
  draft.wip       = false;
  draft.error     = null;
  draft.dashboard = { items, mediaTotal, textTotal };
};

const onSetLanguage = draft => {
  draft.loaded = false;
  draft.wip    = false;
  draft.err    = null;
};

const onFetchDashboardFailure = (draft, payload) => {
  draft.wip   = false;
  draft.error = payload.err;
};

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    receiveTags: onReceiveTags,
    fetchDashboard: onDashboard,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTags.fulfilled, onDashboardSuccess);
    builder.addCase(fetchTags.rejected, onFetchDashboardFailure);

    builder.addCase(HYDRATE, (state, action) => {
      return { ...state, ...action.payload.tags, };
    });
  }
});

/* Selectors */

const areTagsLoaded   = state => state.loaded;
const getTags         = state => state.byId;
const getRoots        = state => state.roots;
const getDisplayRoots = state => state.displayRoots;
const getTagById      = state => id => state.byId[id];
const getPath         = state => source => tracePath(source, getTagById(state));
const getPathByID     = state => {
  const _byId = getTagById(state);
  return id => tracePath(_byId(id), _byId);
};

const getWip   = state => state.wip;
const getError = state => state.error;

const getItems = state => state.dashboard || {};

export const selectors = {
  areTagsLoaded,
  getWip,
  getError,
  getTags,
  getRoots,
  getDisplayRoots,
  getTagById,
  getPath,
  getPathByID,
  getItems
};

