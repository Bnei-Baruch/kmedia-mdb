import { createAction, handleActions } from 'redux-actions';

const FETCH_ASSET = 'Assets/FETCH_ASSET';
const FETCH_ASSET_SUCCESS = 'Assets/FETCH_ASSET_SUCCESS';
const FETCH_ASSET_FAILURE = 'Assets/FETCH_ASSET_FAILURE';

export const types = {
  FETCH_ASSET,
  FETCH_ASSET_SUCCESS,
  FETCH_ASSET_FAILURE,
};

/* Actions */

const fetchAsset = createAction(FETCH_ASSET);
const fetchAssetSuccess = createAction(FETCH_ASSET_SUCCESS, (id, data) => ({ id, data }));
const fetchAssetFailure = createAction(FETCH_ASSET_FAILURE, (id, err) => ({ id, err }));

export const actions = {
  fetchAsset,
  fetchAssetSuccess,
  fetchAssetFailure,
};

/* Reducer */

const initialState = {
  indexById: []
};

const onFetchAsset = (state, action) => ({
  ...state,
  indexById: {
    ...state.indexById,
    [action.payload]: { data: [], wip: true, err: null },
  }
});

const onFetchAssetSuccess = (state, action) => {
  const { id, data } = action.payload;
  return {
    ...state,
    indexById: {
      ...state.indexById,
      [id]: { data, wip: false, err: null },
    }
  }
};

const onFetchAssetFailure = (state, action) => {
  const { id, err } = action.payload;
  return {
    ...state,
    indexById: {
      ...state.indexById,
      [id]: { data: [], wip: false, err },
    },
  }
};

export const reducer = handleActions({
  [FETCH_ASSET]: onFetchAsset,
  [FETCH_ASSET_SUCCESS]: onFetchAssetSuccess,
  [FETCH_ASSET_FAILURE]: onFetchAssetFailure,
}, initialState);

/* Selectors */

const getIndexById = state => state.indexById;

export const selectors = {
  getIndexById,
};
