import { createSlice } from '@reduxjs/toolkit';
import mapValues from 'lodash/mapValues';

import { actions as ssrActions } from './ssr';

const initialState = {
  zipIndexById   : {},
  doc2htmlById   : {},
  sourceIndexById: {},
  asset          : {
    data: null,
    wip : false,
    err : null
  },
  person         : {
    data: null,
    wip : false,
    err : null
  },
  timeCode       : {},
  mergedStatus   : {}
};

const buildKey = (uid, lang) => `${uid}_${lang}`;

const prepare = (type, payload) => {
  const key = getActionKey(type);
  return { payload, key };
};

const onFetchById = (state, action) => {
  const { payload, type } = action;
  const key               = getActionKey(type);
  state[key][payload] ||= {};
  state[key][payload].wip = true;
};

const onFetchByIdSuccess = (state, action) => {
  const { payload, type } = action;
  const { id, data }      = payload;
  const key               = getActionKey(type);
  state[key][id] ||= {};
  state[key][id].data     = data;
  state[key][id].wip      = false;
};

const onFetchByIdFailure = (state, action) => {
  const { payload, type } = action;
  const { id, err }       = payload;
  const key               = getActionKey(type);
  state[key][id] ||= {};
  state[key][id].err      = err;
  state[key][id].wip      = false;
};

const onFetchList = (state, action) => {
  const { payload, type } = action;
  payload.forEach(p => onFetchById(state, {
    type,
    payload: p
  }));
};

const onFetchListSuccess = (state, action) => {
  const { payload, type } = action;
  (payload?.data || []).forEach(p => onFetchByIdSuccess(state, {
    type,
    payload: { id: p.uid, data: p }
  }));
};

const onFetchListFailure = (state, action) => {
  const { payload, type } = action;
  payload.forEach(p => onFetchByIdFailure(state, {
    type,
    payload: { id: p.uid, err: p.err }
  }));
};

const onSSRPrepare = (state, action) => {
  state.zipIndexById    = mapValues(state.zipIndexById, x => ({ ...x, err: x.err ? x.err.toString() : x.err }));
  state.doc2htmlById    = mapValues(state.doc2htmlById, x => ({ ...x, err: x.err ? x.err.toString() : x.err }));
  state.sourceIndexById = mapValues(state.sourceIndexById, x => ({ ...x, err: x.err ? x.err.toString() : x.err }));
  state.asset.err       = state.asset.err ? state.asset.err.toString() : state.asset.err;
  state.person.err      = state.person.err ? state.person.err.toString() : state.person.err;
};

const assetsSlice = createSlice({
  name: 'assets',
  initialState,

  reducers     : {
    unzip       : (state, action) => onFetchById(state, action),
    unzipSuccess: {
      prepare,
      reducer: (state, action) => onFetchByIdSuccess(state, action)
    },
    unzipFailure: {
      prepare,
      reducer: (state, action) => onFetchByIdFailure(state, action)
    },

    unzipList       : (state, action) => onFetchList(state, action),
    unzipListSuccess: {
      prepare,
      reducer: (state, action) => onFetchListSuccess(state, action)
    },
    unzipListFailure: {
      prepare,
      reducer: (state, action) => onFetchListFailure(state, action)
    },

    doc2html       : (state, action) => onFetchById(state, action),
    doc2htmlSuccess: {
      prepare,
      reducer: (state, action) => onFetchByIdSuccess(state, action)
    },
    doc2htmlFailure: {
      prepare,
      reducer: (state, action) => onFetchByIdFailure(state, action)
    },

    sourceIndex       : (state, action) => onFetchById(state, action),
    sourceIndexSuccess: {
      prepare,
      reducer: (state, action) => onFetchByIdSuccess(state, action)
    },
    sourceIndexFailure: {
      prepare,
      reducer: (state, action) => onFetchByIdFailure(state, action)
    },

    fetchAsset       : (state, _) => state.asset.wip = true,
    fetchAssetSuccess: (state, action) => {
      state.asset.data = action.payload;
      state.asset.wip  = false;
      state.asset.err  = null;
    },
    fetchAssetFailure: (state, action) => {
      state.asset.wip = false;
      state.asset.err = action.payload;
    },

    fetchPerson       : (state, _) => state.person.wip = true,
    fetchPersonSuccess: (state, action) => {
      state.person.data = action.payload;
      state.person.wip  = false;
      state.person.err  = null;
    },
    fetchPersonFailure: (state, action) => {
      state.person.wip = false;
      state.person.err = action.payload;
    },

    fetchTimeCode       : (state, _) => {
      state.timeCode = {};
    },
    fetchTimeCodeSuccess: (state, action) => {
      const { payload } = action;
      state.timeCode    = {};
      for (const idx in payload) {
        const { index, timeCode: tc } = payload[idx];
        state.timeCode[index]         = tc;
      }
    },

    mergeKiteiMakor       : {
      prepare: (id, lang) => {
        const payload = { id, lang };
        return { payload };
      },
      reducer: (state, action) => {
        const { id, lang }                     = action.payload;
        state.mergedStatus[buildKey(id, lang)] = 'wip';
      }
    },
    mergeKiteiMakorSuccess: {
      prepare: (id, lang, status = 'ok') => {
        const payload = { id, lang, status };
        return { payload };
      },
      reducer: (state, action) => {
        const { id, lang, status }             = action.payload;
        state.mergedStatus[buildKey(id, lang)] = status;
      }
    },
    mergeKiteiMakorFailure: {
      prepare: (id, lang, status = 'none') => {
        const payload = { id, lang, status };
        return { payload };
      },
      reducer: (state, action) => {
        const { id, lang, status }             = action.payload;
        state.mergedStatus[buildKey(id, lang)] = status;
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(ssrActions.prepare, onSSRPrepare);
  }
});

const getActionKey = type => {
  switch (type) {
    case 'assets/unzip':
    case 'assets/unzipSuccess':
    case 'assets/unzipFailrue':
    case 'assets/unzipList':
    case 'assets/unzipListSuccess':
    case 'assets/unzipListFailure':
      return 'zipIndexById';
    case 'assets/doc2html':
    case 'assets/doc2htmlSuccess':
    case 'assets/doc2htmlFailure':
      return 'doc2htmlById';
    case 'assets/sourceIndex':
    case 'assets/sourceIndexSuccess':
    case 'assets/sourceIndexFailure':
      return 'sourceIndexById';
    default:
      throw new Error(`Unknown action key: ${type}`);
  }
};

export default assetsSlice.reducer;

/* eslint-disable indent */
export const {
               unzip,
               unzipSuccess,
               unzipFailure,
               unzipList,
               unzipListSuccess,
               unzipListFailure,
               doc2html,
               doc2htmlSuccess,
               doc2htmlFailure,
               sourceIndex,
               sourceIndexSuccess,
               sourceIndexFailure,
               fetchAsset,
               fetchAssetSuccess,
               fetchAssetFailure,
               fetchPerson,
               fetchPersonSuccess,
               fetchPersonFailure,
               fetchTimeCode,
               fetchTimeCodeSuccess,
               mergeKiteiMakor,
               mergeKiteiMakorSuccess,
               mergeKiteiMakorFailure
             } = assetsSlice.actions;
/* eslint-enable */

export const types = Object.fromEntries(new Map(
  Object.values(assetsSlice.actions).map(a => [a.type, a.type])
));

/* Selectors */

const getZipIndexById            = state => state.zipIndexById;
const nestedGetZipById           = state => id => state.zipIndexById[id];
const getDoc2htmlById            = state => state.doc2htmlById;
const getSourceIndexById         = state => state.sourceIndexById;
const getAsset                   = state => state.asset;
const getPerson                  = state => state.person;
const getTimeCode                = state => pos => recursiveFindPrevTimeByPos(pos, state);
const recursiveFindPrevTimeByPos = (pos, state) => {
  if (pos === 0 || state.timeCode.size === 0) return 0;
  if (state.timeCode.has(pos)) return state.timeCode.get(pos);
  return recursiveFindPrevTimeByPos(pos - 1, state);
};

const hasTimeCode    = state => state.timeCode?.size > 0;
const getMergeStatus = state => (id, lang) => state.mergedStatus[buildKey(id, lang)];

export const selectors = {
  getZipIndexById,
  nestedGetZipById,
  getDoc2htmlById,
  getSourceIndexById,
  getAsset,
  getPerson,
  getTimeCode,
  hasTimeCode,
  getMergeStatus
};
