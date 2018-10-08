import { createAction, handleActions } from 'redux-actions';
import mapValues from 'lodash/mapValues';

import { types as ssr } from './ssr';

const UNZIP                = 'Assets/UNZIP';
const UNZIP_SUCCESS        = 'Assets/UNZIP_SUCCESS';
const UNZIP_FAILURE        = 'Assets/UNZIP_FAILURE';
const DOC2HTML             = 'Assets/DOC2HTML';
const DOC2HTML_SUCCESS     = 'Assets/DOC2HTML_SUCCESS';
const DOC2HTML_FAILURE     = 'Assets/DOC2HTML_FAILURE';
const SOURCE_INDEX         = 'Assets/SOURCE_INDEX';
const SOURCE_INDEX_SUCCESS = 'Assets/SOURCE_INDEX_SUCCESS';
const SOURCE_INDEX_FAILURE = 'Assets/SOURCE_INDEX_FAILURE';
const FETCH_ASSET          = 'Assets/FETCH_ASSET';
const FETCH_ASSET_SUCCESS  = 'Assets/FETCH_ASSET_SUCCESS';
const FETCH_ASSET_FAILURE  = 'Assets/FETCH_ASSET_FAILURE';

export const types = {
  UNZIP,
  UNZIP_SUCCESS,
  UNZIP_FAILURE,
  DOC2HTML,
  DOC2HTML_SUCCESS,
  DOC2HTML_FAILURE,
  SOURCE_INDEX,
  SOURCE_INDEX_SUCCESS,
  SOURCE_INDEX_FAILURE,
  FETCH_ASSET,
  FETCH_ASSET_SUCCESS,
  FETCH_ASSET_FAILURE,
};

/* Actions */

const unzip              = createAction(UNZIP);
const unzipSuccess       = createAction(UNZIP_SUCCESS, (id, data) => ({ id, data }));
const unzipFailure       = createAction(UNZIP_FAILURE, (id, err) => ({ id, err }));
const doc2html           = createAction(DOC2HTML);
const doc2htmlSuccess    = createAction(DOC2HTML_SUCCESS, (id, data) => ({ id, data }));
const doc2htmlFailure    = createAction(DOC2HTML_FAILURE, (id, err) => ({ id, err }));
const sourceIndex        = createAction(SOURCE_INDEX);
const sourceIndexSuccess = createAction(SOURCE_INDEX_SUCCESS, (id, data) => ({ id, data }));
const sourceIndexFailure = createAction(SOURCE_INDEX_FAILURE, (id, err) => ({ id, err }));
const fetchAsset         = createAction(FETCH_ASSET);
const fetchAssetSuccess  = createAction(FETCH_ASSET_SUCCESS);
const fetchAssetFailure  = createAction(FETCH_ASSET_FAILURE);

export const actions = {
  unzip,
  unzipSuccess,
  unzipFailure,
  doc2html,
  doc2htmlSuccess,
  doc2htmlFailure,
  sourceIndex,
  sourceIndexSuccess,
  sourceIndexFailure,
  fetchAsset,
  fetchAssetSuccess,
  fetchAssetFailure,
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
};

const onSSRPrepare = state => ({
  zipIndexById: mapValues(state.zipIndexById, x => ({ ...x, err: x.err ? x.err.toString() : x.err })),
  doc2htmlById: mapValues(state.doc2htmlById, x => ({ ...x, err: x.err ? x.err.toString() : x.err })),
  sourceIndexById: mapValues(state.sourceIndexById, x => ({ ...x, err: x.err ? x.err.toString() : x.err })),
  asset: ({ ...state.asset, err: state.asset.err ? state.asset.err.toString() : state.asset.err }),
});

const getActionKey = (action) => {
  switch (action.type) {
  case UNZIP:
  case UNZIP_SUCCESS:
  case UNZIP_FAILURE:
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
    throw new Error(`Unknown action key: ${action.type}`);
  }
};

const onFetchById = (state, action) => {
  const key = getActionKey(action);
  return {
    ...state,
    [key]: { [action.payload]: { wip: true }, ...(state[key]) }
  };
};

const onFetchByIdSuccess = (state, action) => {
  const key          = getActionKey(action);
  const { id, data } = action.payload;
  return {
    ...state,
    [key]: { ...(state[key]), [id]: { data } }
  };
};

const onFetchByIdFailure = (state, action) => {
  const key         = getActionKey(action);
  const { id, err } = action.payload;
  return {
    ...state,
    [key]: { [id]: { err }, ...(state[key]) }
  };
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [UNZIP]: onFetchById,
  [UNZIP_SUCCESS]: onFetchByIdSuccess,
  [UNZIP_FAILURE]: onFetchByIdFailure,

  [DOC2HTML]: onFetchById,
  [DOC2HTML_SUCCESS]: onFetchByIdSuccess,
  [DOC2HTML_FAILURE]: onFetchByIdFailure,

  [SOURCE_INDEX]: onFetchById,
  [SOURCE_INDEX_SUCCESS]: onFetchByIdSuccess,
  [SOURCE_INDEX_FAILURE]: onFetchByIdFailure,

  [FETCH_ASSET]: state => ({
    ...state,
    asset: { wip: true }
  }),

  [FETCH_ASSET_SUCCESS]: (state, action) => ({
    ...state,
    asset: { data: action.payload, wip: false, err: null }
  }),

  [FETCH_ASSET_FAILURE]: (state, action) => ({
    ...state,
    asset: { wip: false, err: action.payload }
  }),
}, initialState);

/* Selectors */

const getZipIndexById    = state => state.zipIndexById;
const getDoc2htmlById    = state => state.doc2htmlById;
const getSourceIndexById = state => state.sourceIndexById;
const getAsset           = state => state.asset;

export const selectors = {
  getZipIndexById,
  getDoc2htmlById,
  getSourceIndexById,
  getAsset,
};
