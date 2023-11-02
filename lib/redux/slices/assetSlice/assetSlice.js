import mapValues from 'lodash/mapValues';
import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import {
  fetchAsset,
  fetchSource,
  unzipList,
  unzip,
  fetchTimeCode,
  fetchPerson,
  doc2Html,
  mergeKiteiMakor
} from '@/app/api/assets';


/* Reducer */

const initialState = {
  zipIndexById: {},
  doc2htmlById: {},
  sourceIndexById: {},
  asset: {
    data: null,
    wip: false,
    err: null,
  },
  person: {
    data: null,
    wip: false,
    err: null,
  },
  timeCode: {},
  mergedStatus: {}
};

const getActionKey = type => {
  switch (type) {
    case unzip.fulfilled.type:
    case unzip.rejected.type:
    case unzipList.rejected.type:
    case unzipList.fulfilled.type:
      return 'zipIndexById';
    case doc2Html.fulfilled.type:
    case doc2Html.rejected.type:
      return 'doc2htmlById';
    case fetchSource.fulfilled.type:
    case fetchSource.rejected.type:
      return 'sourceIndexById';
    default:
      throw new Error(`Unknown action key: ${type}`);
  }
};

const onFetchById = (draft, { payload, type }) => {
  const key               = getActionKey(type);
  draft[key][payload]     = draft[key][payload] || {};
  draft[key][payload].wip = true;
};

const onFetchByIdSuccess     = (state, { payload, type }) => {
  const { id, data } = payload;
  fetchByIdSuccess(state, id, data, type);
};
const onFetchByIdFailure     = (state, action) => {
  const { type, error, meta } = action;
  fetchByIdFailure(state, meta.arg, error.message, type);
};
const fetchByIdSuccess       = (state, id, data, type) => {
  const key           = getActionKey(type);
  state[key][id]      = state[key][id] || {};
  state[key][id].data = data;
  state[key][id].wip  = false;
};
const fetchByIdFailure       = (state, id, err, type) => {
  const key          = getActionKey(type);
  state[key][id]     = state[key][id] || {};
  state[key][id].err = err;
  state[key][id].wip = false;
};
const onFetchListSuccess     = (state, { payload, type }) => {
  payload.data.forEach(p => fetchByIdSuccess(state, p.uid, p, type));
};
const onFetchListFailure     = (state, action) => {
  const { type, error, meta } = action;
  meta.arg.ids.forEach(id => fetchByIdFailure(state, id, error.message, type));
};
const onFetchAssetSuccess    = (draft, { error }) => {
  draft.asset.data = error.message;
  draft.asset.wip  = false;
  draft.asset.err  = null;
};
const onFetchAssetFailure    = (draft, { payload }) => {
  draft.asset.wip = false;
  draft.asset.err = payload;
};
const onFetchPersonSuccess   = (draft, { payload }) => {
  draft.person.wip  = false;
  draft.person.err  = null;
  draft.person.data = payload.content;
};
const onFetchPersonFailure   = (draft, { error }) => {
  draft.person.wip = false;
  draft.person.err = error.message;
};
const onFetchTimeCodeSuccess = (draft, { payload }) => {
  const timeCode = {};
  for (const idx in payload) {
    const { index, timeCode: tc } = payload[idx];
    timeCode[index]               = tc;
  }
  draft.timeCode = timeCode;
};
const onMergeSuccess         = (state, { payload }) => {
  const { id, lang, status = 'ok' }      = payload;
  state.mergedStatus[buildKey(id, lang)] = status;
};
const onMergeFailure         = (state, action) => {
  const { id, lang }                     = action.meta.arg;
  state.mergedStatus[buildKey(id, lang)] = action.error.message;
};
const buildKey               = (uid, lang) => `${uid}_${lang}`;

export const assetSlice = createSlice({
  name: 'assets',
  initialState,
  extraReducers: (builder) => {
    /*builder.addCase(HYDRATE, (state, action) => ({ ...state, ...action.payload.assets }));

    builder.addCase(unzip.fulfilled, onFetchByIdSuccess);
    builder.addCase(unzip.rejected, onFetchByIdFailure);

    builder.addCase(unzipList.fulfilled, onFetchListSuccess);
    builder.addCase(unzipList.rejected, onFetchListFailure);

    builder.addCase(doc2Html.fulfilled, onFetchByIdSuccess);
    builder.addCase(doc2Html.rejected, onFetchByIdFailure);

    builder.addCase(fetchSource.fulfilled, onFetchByIdSuccess);
    builder.addCase(fetchSource.rejected, onFetchByIdFailure);

    builder.addCase(fetchAsset.fulfilled, onFetchAssetSuccess);
    builder.addCase(fetchAsset.rejected, onFetchAssetFailure);

    builder.addCase(fetchPerson.fulfilled, onFetchPersonSuccess);
    builder.addCase(fetchPerson.rejected, onFetchPersonFailure);

    builder.addCase(fetchTimeCode.fulfilled, onFetchTimeCodeSuccess);

    builder.addCase(mergeKiteiMakor.fulfilled, onMergeSuccess);
    builder.addCase(mergeKiteiMakor.rejected, onMergeFailure);*/
  }
});

/* Selectors */

const getZipIndexById            = state => state.zipIndexById;
const nestedGetZipById           = state => id => state.zipIndexById[id];
const getDoc2htmlById            = state => state.doc2htmlById;
const getSourceIndexById         = state => state.sourceIndexById;
const getAsset                   = state => state.asset;
const getPerson                  = state => state.person;
const getTimeCode                = state => pos => recursiveFindPrevTimeByPos(pos, state);
const recursiveFindPrevTimeByPos = (pos, state) => {
  if (pos === 0 || Object.keys(state.timeCode).length === 0) return 0;
  return state.timeCode[pos] ?? recursiveFindPrevTimeByPos(pos - 1, state);
};
const hasTimeCode                = state => Object.keys(state.timeCode).length > 0;
const getMergeStatus             = state => (id, lang) => {
  return state.mergedStatus[buildKey(id, lang)];
};

export const selectors = {
  getZipIndexById,
  nestedGetZipById,
  getDoc2htmlById,
  getSourceIndexById,
  getAsset,
  getPerson,
  getTimeCode,
  hasTimeCode,
  getMergeStatus,
};
