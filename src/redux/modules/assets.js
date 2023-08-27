import { createAction } from 'redux-actions';
import mapValues from 'lodash/mapValues';

import { handleActions } from './settings';
import { types as ssr } from './ssr';

const UNZIP                   = 'Assets/UNZIP';
const UNZIP_SUCCESS           = 'Assets/UNZIP_SUCCESS';
const UNZIP_FAILURE           = 'Assets/UNZIP_FAILURE';
const UNZIP_LIST              = 'Assets/UNZIP_LIST';
const UNZIP_LIST_SUCCESS      = 'Assets/UNZIP_LIST_SUCCESS';
const UNZIP_LIST_FAILURE      = 'Assets/UNZIP_LIST_FAILURE';
const DOC2HTML                = 'Assets/DOC2HTML';
const DOC2HTML_SUCCESS        = 'Assets/DOC2HTML_SUCCESS';
const DOC2HTML_FAILURE        = 'Assets/DOC2HTML_FAILURE';
const SOURCE_INDEX            = 'Assets/SOURCE_INDEX';
const SOURCE_INDEX_SUCCESS    = 'Assets/SOURCE_INDEX_SUCCESS';
const SOURCE_INDEX_FAILURE    = 'Assets/SOURCE_INDEX_FAILURE';
const FETCH_ASSET             = 'Assets/FETCH_ASSET';
const FETCH_ASSET_SUCCESS     = 'Assets/FETCH_ASSET_SUCCESS';
const FETCH_ASSET_FAILURE     = 'Assets/FETCH_ASSET_FAILURE';
const FETCH_PERSON            = 'Assets/FETCH_PERSON';
const FETCH_PERSON_SUCCESS    = 'Assets/FETCH_PERSON_SUCCESS';
const FETCH_PERSON_FAILURE    = 'Assets/FETCH_PERSON_FAILURE';
const FETCH_TIME_CODE         = 'Assets/FETCH_TIME_CODE';
const FETCH_TIME_CODE_SUCCESS = 'Assets/FETCH_TIME_CODE_SUCCESS';
const MARGIN_AUDIO            = 'Assets/MARGIN_AUDIO';
const MARGIN_AUDIO_SUCCESS    = 'Assets/MARGIN_AUDIO_SUCCESS';

const MERGE_KITEI_MAKOR         = 'MERGE_KITEI_MAKOR';
const MERGE_KITEI_MAKOR_SUCCESS = 'MERGE_KITEI_MAKOR_SUCCESS';
const MERGE_KITEI_MAKOR_FAILURE = 'MERGE_KITEI_MAKOR_FAILURE';

export const types = {
  UNZIP,
  UNZIP_SUCCESS,
  UNZIP_FAILURE,
  UNZIP_LIST,
  DOC2HTML,
  DOC2HTML_SUCCESS,
  DOC2HTML_FAILURE,
  SOURCE_INDEX,
  SOURCE_INDEX_SUCCESS,
  SOURCE_INDEX_FAILURE,
  FETCH_ASSET,
  FETCH_ASSET_SUCCESS,
  FETCH_ASSET_FAILURE,
  FETCH_PERSON,
  FETCH_TIME_CODE,
  MERGE_KITEI_MAKOR,
};

/* Actions */

const unzip                  = createAction(UNZIP);
const unzipSuccess           = createAction(UNZIP_SUCCESS, (id, data) => ({ id, data }));
const unzipFailure           = createAction(UNZIP_FAILURE, (id, err) => ({ id, err }));
const unzipList              = createAction(UNZIP_LIST);
const unzipListSuccess       = createAction(UNZIP_LIST_SUCCESS);
const unzipListFailure       = createAction(UNZIP_LIST_FAILURE);
const doc2html               = createAction(DOC2HTML);
const doc2htmlSuccess        = createAction(DOC2HTML_SUCCESS, (id, data) => ({ id, data }));
const doc2htmlFailure        = createAction(DOC2HTML_FAILURE, (id, err) => ({ id, err }));
const sourceIndex            = createAction(SOURCE_INDEX);
const sourceIndexSuccess     = createAction(SOURCE_INDEX_SUCCESS, (id, data) => ({ id, data }));
const sourceIndexFailure     = createAction(SOURCE_INDEX_FAILURE, (id, err) => ({ id, err }));
const fetchAsset             = createAction(FETCH_ASSET);
const fetchAssetSuccess      = createAction(FETCH_ASSET_SUCCESS);
const fetchAssetFailure      = createAction(FETCH_ASSET_FAILURE);
const fetchPerson            = createAction(FETCH_PERSON);
const fetchPersonSuccess     = createAction(FETCH_PERSON_SUCCESS);
const fetchPersonFailure     = createAction(FETCH_PERSON_FAILURE);
const fetchTimeCode          = createAction(FETCH_TIME_CODE, (uid, language) => ({ uid, language }));
const fetchTimeCodeSuccess   = createAction(FETCH_TIME_CODE_SUCCESS);
const marginAudio            = createAction(MARGIN_AUDIO, (uid, language) => ({ uid, language }));
const marginAudioSuccess     = createAction(MARGIN_AUDIO_SUCCESS);
const mergeKiteiMAkor        = createAction(MERGE_KITEI_MAKOR);
const mergeKiteiMAkorSuccess = createAction(MERGE_KITEI_MAKOR_SUCCESS);
const mergeKiteiMAkorFailure = createAction(MERGE_KITEI_MAKOR_FAILURE);

export const actions = {
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
  marginAudio,
  marginAudioSuccess,
  mergeKiteiMAkor,
  mergeKiteiMAkorSuccess,
  mergeKiteiMAkorFailure,
};

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
  timeCode: new Map(),
  mergedStatus: {}
};

const onSSRPrepare = draft => {
  draft.zipIndexById    = mapValues(draft.zipIndexById, x => ({ ...x, err: x.err ? x.err.toString() : x.err }));
  draft.doc2htmlById    = mapValues(draft.doc2htmlById, x => ({ ...x, err: x.err ? x.err.toString() : x.err }));
  draft.sourceIndexById = mapValues(draft.sourceIndexById, x => ({ ...x, err: x.err ? x.err.toString() : x.err }));
  draft.asset.err       = draft.asset.err ? draft.asset.err.toString() : draft.asset.err;
  draft.person.err      = draft.person.err ? draft.person.err.toString() : draft.person.err;
};

const getActionKey = type => {
  switch (type) {
    case UNZIP:
    case UNZIP_SUCCESS:
    case UNZIP_FAILURE:
    case UNZIP_LIST:
    case UNZIP_LIST_SUCCESS:
    case UNZIP_LIST_FAILURE:
      return 'zipIndexById';
    case DOC2HTML:
    case DOC2HTML_SUCCESS:
    case DOC2HTML_FAILURE:
      return 'doc2htmlById';
    case SOURCE_INDEX:
    case SOURCE_INDEX_SUCCESS:
    case SOURCE_INDEX_FAILURE:
      return 'sourceIndexById';
    default:
      throw new Error(`Unknown action key: ${type}`);
  }
};

const onFetchById = (draft, payload, type) => {
  const key               = getActionKey(type);
  draft[key][payload]     = draft[key][payload] || {};
  draft[key][payload].wip = true;
};

const onFetchByIdSuccess = (draft, payload, type) => {
  const key           = getActionKey(type);
  const { id, data }  = payload;
  draft[key][id]      = draft[key][id] || {};
  draft[key][id].data = data;
  draft[key][id].wip  = false;
};

const onFetchByIdFailure = (draft, payload, type) => {
  const key          = getActionKey(type);
  const { id, err }  = payload;
  draft[key][id]     = draft[key][id] || {};
  draft[key][id].err = err;
  draft[key][id].wip = false;
};

const onFetchList = (draft, payload, type) => {
  payload.forEach(p => onFetchById(draft, p, type));
};

const onFetchListSuccess = (draft, payload, type) => {
  payload.forEach(p => onFetchByIdSuccess(draft, { id: p.uid, data: p }, type));
};

const onFetchListFailure = (draft, payload, type) => payload.forEach(p => onFetchByIdFailure(draft, p, type));

const onFetchAsset = draft => {
  draft.asset.wip = true;
};

const onFetchAssetSuccess = (draft, payload) => {
  draft.asset.data = payload;
  draft.asset.wip  = false;
  draft.asset.err  = null;
};

const onFetchAssetFailure = (draft, payload) => {
  draft.asset.wip = false;
  draft.asset.err = payload;
};

const onFetchPerson = draft => {
  draft.person.wip = true;
};

const onFetchPersonSuccess = (draft, payload) => {
  draft.person.wip  = false;
  draft.person.err  = null;
  draft.person.data = payload.content;
};

const onFetchPersonFailure = (draft, payload) => {
  draft.person.wip = false;
  draft.person.err = payload;
};
const onFetchTimeCode      = draft => {
  draft.timeCode = new Map();
};

const onFetchTimeCodeSuccess = (draft, payload) => {
  const timeCode = new Map();
  for (const idx in payload) {
    const { index, timeCode: tc } = payload[idx];
    timeCode.set(index, tc);
  }
  draft.timeCode = timeCode;
};

const onMerge        = (state, { id, lang }) => {
  state.mergedStatus[buildKey(id, lang)] = 'wip';
};
const onMergeSuccess = (state, { id, lang, status = 'ok' }) => {
  state.mergedStatus[buildKey(id, lang)] = status;
};
const onMergeFailure = (state, { id, lang, status = 'none' }) => {
  state.mergedStatus[buildKey(id, lang)] = status;
};
const buildKey       = (uid, lang) => `${uid}_${lang}`;
export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [UNZIP]: onFetchById,
  [UNZIP_SUCCESS]: onFetchByIdSuccess,
  [UNZIP_FAILURE]: onFetchByIdFailure,
  [UNZIP_LIST]: onFetchList,
  [UNZIP_LIST_SUCCESS]: onFetchListSuccess,
  [UNZIP_LIST_FAILURE]: onFetchListFailure,

  [DOC2HTML]: onFetchById,
  [DOC2HTML_SUCCESS]: onFetchByIdSuccess,
  [DOC2HTML_FAILURE]: onFetchByIdFailure,

  [SOURCE_INDEX]: onFetchById,
  [SOURCE_INDEX_SUCCESS]: onFetchByIdSuccess,
  [SOURCE_INDEX_FAILURE]: onFetchByIdFailure,

  [FETCH_ASSET]: onFetchAsset,
  [FETCH_ASSET_SUCCESS]: onFetchAssetSuccess,
  [FETCH_ASSET_FAILURE]: onFetchAssetFailure,

  [FETCH_PERSON]: onFetchPerson,
  [FETCH_PERSON_SUCCESS]: onFetchPersonSuccess,
  [FETCH_PERSON_FAILURE]: onFetchPersonFailure,

  [FETCH_TIME_CODE]: onFetchTimeCode,
  [FETCH_TIME_CODE_SUCCESS]: onFetchTimeCodeSuccess,

  [MERGE_KITEI_MAKOR]: onMerge,
  [MERGE_KITEI_MAKOR_SUCCESS]: onMergeSuccess,
  [MERGE_KITEI_MAKOR_FAILURE]: onMergeFailure,
}, initialState);

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
const hasTimeCode                = state => state.timeCode?.size > 0;
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
