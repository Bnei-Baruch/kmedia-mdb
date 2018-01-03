import { createAction, handleActions } from 'redux-actions';

import { types as settings } from './settings';

/* Types */

const SET_PAGE            = 'Lectures/SET_PAGE';
const SET_COLLECTION_PAGE = 'Lectures/SET_COLLECTION_PAGE';

const FETCH_LIST                    = 'Lectures/FETCH_LIST';
const FETCH_LIST_SUCCESS            = 'Lectures/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE            = 'Lectures/FETCH_LIST_FAILURE';
const FETCH_UNIT                    = 'Lectures/FETCH_UNIT';
const FETCH_UNIT_SUCCESS            = 'Lectures/FETCH_UNIT_SUCCESS';
const FETCH_UNIT_FAILURE            = 'Lectures/FETCH_UNIT_FAILURE';
const FETCH_COLLECTION              = 'Lectures/FETCH_COLLECTION';
const FETCH_COLLECTION_SUCCESS      = 'Lectures/FETCH_COLLECTION_SUCCESS';
const FETCH_COLLECTION_FAILURE      = 'Lectures/FETCH_COLLECTION_FAILURE';
const FETCH_COLLECTION_LIST         = 'Lectures/FETCH_COLLECTION_LIST';
const FETCH_COLLECTION_LIST_SUCCESS = 'Lectures/FETCH_COLLECTION_LIST_SUCCESS';
const FETCH_COLLECTION_LIST_FAILURE = 'Lectures/FETCH_COLLECTION_LIST_FAILURE';

export const types = {
  SET_PAGE,
  SET_COLLECTION_PAGE,
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
  FETCH_UNIT,
  FETCH_UNIT_SUCCESS,
  FETCH_UNIT_FAILURE,
  FETCH_COLLECTION,
  FETCH_COLLECTION_SUCCESS,
  FETCH_COLLECTION_FAILURE,
  FETCH_COLLECTION_LIST,
  FETCH_COLLECTION_LIST_SUCCESS,
  FETCH_COLLECTION_LIST_FAILURE,
};

/* Actions */

const setPage                    = createAction(SET_PAGE);
const setCollectionPage          = createAction(SET_COLLECTION_PAGE);
const fetchList                  = createAction(FETCH_LIST, ({ pageNo, language, pageSize }) => ({
  pageNo,
  language,
  pageSize,
}));
const fetchListSuccess           = createAction(FETCH_LIST_SUCCESS);
const fetchListFailure           = createAction(FETCH_LIST_FAILURE);
const fetchUnit                  = createAction(FETCH_UNIT);
const fetchUnitSuccess           = createAction(FETCH_UNIT_SUCCESS);
const fetchUnitFailure           = createAction(FETCH_UNIT_FAILURE, (id, err) => ({ id, err }));
const fetchCollection            = createAction(FETCH_COLLECTION);
const fetchCollectionSuccess     = createAction(FETCH_COLLECTION_SUCCESS);
const fetchCollectionFailure     = createAction(FETCH_COLLECTION_FAILURE, (id, err) => ({ id, err }));
const fetchCollectionList        = createAction(FETCH_COLLECTION_LIST, (pageNo, pageSize, language, id) => ({
  pageNo,
  pageSize,
  language,
  collection: id,
}));
const fetchCollectionListSuccess = createAction(FETCH_COLLECTION_LIST_SUCCESS);
const fetchCollectionListFailure = createAction(FETCH_COLLECTION_LIST_FAILURE);

export const actions = {
  setPage,
  setCollectionPage,
  fetchList,
  fetchListSuccess,
  fetchListFailure,
  fetchUnit,
  fetchUnitSuccess,
  fetchUnitFailure,
  fetchCollection,
  fetchCollectionSuccess,
  fetchCollectionFailure,
  fetchCollectionList,
  fetchCollectionListSuccess,
  fetchCollectionListFailure,
};

/* Reducer */

const initialState = {
  total: 0,
  pageNo: 1,
  items: [],
  collectionPaging: {
    total: 0,
    pageNo: 1,
    items: [],
  },
  wip: {
    list: false,
    collectionList: false,
    units: {},
    collections: {}
  },
  errors: {
    list: null,
    collectionList: null,
    units: {},
    collections: {}
  },
};

/**
 * Set the wip and errors part of the state
 * @param state
 * @param action
 * @returns {{wip: {}, errors: {}}}
 */
const setStatus = (state, action) => {
  const wip    = { ...state.wip };
  const errors = { ...state.errors };

  switch (action.type) {
  case FETCH_LIST:
    wip.list = true;
    break;
  case FETCH_UNIT:
    wip.units = { ...wip.units, [action.payload]: true };
    break;
  case FETCH_COLLECTION:
    wip.collections = { ...wip.collections, [action.payload]: true };
    break;
  case FETCH_COLLECTION_LIST:
    wip.collectionList = true;
    break;
  case FETCH_LIST_SUCCESS:
    wip.list    = false;
    errors.list = null;
    break;
  case FETCH_UNIT_SUCCESS:
    wip.units    = { ...wip.units, [action.payload]: false };
    errors.units = { ...errors.units, [action.payload]: null };
    break;
  case FETCH_COLLECTION_SUCCESS:
    wip.collections    = { ...wip.collections, [action.payload]: false };
    errors.collections = { ...errors.collections, [action.payload]: null };
    break;
  case FETCH_COLLECTION_LIST_SUCCESS:
    wip.collectionList    = false;
    errors.collectionList = null;
    break;
  case FETCH_LIST_FAILURE:
    wip.list    = false;
    errors.list = action.payload;
    break;
  case FETCH_UNIT_FAILURE:
    wip.units    = { ...wip.units, [action.payload.id]: false };
    errors.units = { ...errors.units, [action.payload.id]: action.payload.err };
    break;
  case FETCH_COLLECTION_FAILURE:
    wip.collections    = { ...wip.collections, [action.payload.id]: false };
    errors.collections = { ...errors.collections, [action.payload.id]: action.payload.err };
    break;
  case FETCH_COLLECTION_LIST_FAILURE:
    wip.collectionList    = false;
    errors.collectionList = action.payload;
    break;
  default:
    break;
  }

  return {
    ...state,
    wip,
    errors,
  };
};

const onFetchListSuccess = (state, action) => {
  const items = action.payload.collections || action.payload.content_units || [];
  return {
    ...state,
    total: action.payload.total,
    items: items.map(x => x.id),
  };
};

const onFetchCollectionListSuccess = (state, action) => {
  const items = action.payload.collections || action.payload.content_units || [];
  return {
    ...state,
    collectionPaging: {
      ...state.collectionPaging,
      total: action.payload.total,
      items: items.map(x => x.id),
    }
  };
};

const onSetPage = (state, action) => (
  {
    ...state,
    pageNo: action.payload
  }
);

const onSetCollectionPage = (state, action) => {
  return {
    ...state,
    collectionPaging: {
      ...state.collectionPaging,
      pageNo: action.payload
    }
  };
};

const onSetLanguage = state => (
  {
    ...state,
    items: [],
    collectionPaging: {
      ...state.collectionPaging,
      items: [],
    },
  }
);

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_LIST]: setStatus,
  [FETCH_LIST_SUCCESS]: (state, action) =>
    setStatus(onFetchListSuccess(state, action), action),
  [FETCH_LIST_FAILURE]: setStatus,
  [FETCH_UNIT]: setStatus,
  [FETCH_UNIT_SUCCESS]: setStatus,
  [FETCH_UNIT_FAILURE]: setStatus,
  [FETCH_COLLECTION]: setStatus,
  [FETCH_COLLECTION_SUCCESS]: setStatus,
  [FETCH_COLLECTION_FAILURE]: setStatus,
  [FETCH_COLLECTION_LIST]: setStatus,
  [FETCH_COLLECTION_LIST_SUCCESS]: (state, action) =>
    setStatus(onFetchCollectionListSuccess(state, action), action),
  [FETCH_COLLECTION_LIST_FAILURE]: setStatus,

  [SET_PAGE]: onSetPage,
  [SET_COLLECTION_PAGE]: onSetCollectionPage,
}, initialState);

/* Selectors */

const getTotal            = state => state.total;
const getPageNo           = state => state.pageNo;
const getItems            = state => state.items;
const getCollectionPaging = state => state.collectionPaging;
const getWip              = state => state.wip;
const getErrors           = state => state.errors;

export const selectors = {
  getTotal,
  getItems,
  getCollectionPaging,
  getPageNo,
  getWip,
  getErrors,
};
