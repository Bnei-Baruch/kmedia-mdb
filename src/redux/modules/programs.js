import { createAction, handleActions } from 'redux-actions';

import { CT_VIDEO_PROGRAM } from '../../helpers/consts';
/* Types */

const SET_PAGE = 'Programs/SET_PAGE';

const FETCH_LIST           = 'Programs/FETCH_LIST';
const FETCH_LIST_SUCCESS   = 'Programs/FETCH_LIST_SUCCESS';
const FETCH_LIST_FAILURE   = 'Programs/FETCH_LIST_FAILURE';

export const types = {
  SET_PAGE,
  FETCH_LIST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
};

/* Actions */

const setPage            = createAction(SET_PAGE);
const fetchList          = createAction(FETCH_LIST, (pageNo, language, pageSize) => ({ content_type: CT_VIDEO_PROGRAM, pageNo, language, pageSize }));
const fetchListSuccess   = createAction(FETCH_LIST_SUCCESS);
const fetchListFailure   = createAction(FETCH_LIST_FAILURE);

export const actions = {
  setPage,
  fetchList,
  fetchListSuccess,
  fetchListFailure,
};

/* Reducer */

const initialState = {
  total: 0,
  items: [],
  pageNo: 1,
  error: null
};

const onFetchListSuccess = (state, action) => {
  const items = action.payload.collections || action.payload.content_units || [];
  return {
    ...state,
    total: action.payload.total,
    items: items.map(x => [x.id, x.content_type]),
  };
};

const onSetPage = (state, action) => (
  {
    ...state,
    pageNo: action.payload
  }
);

export const reducer = handleActions({
  [FETCH_LIST_SUCCESS]: onFetchListSuccess,
  [SET_PAGE]: onSetPage,
}, initialState);

/* Selectors */

const getTotal  = state => state.total;
const getItems  = state => state.items;
const getPageNo = state => state.pageNo;

export const selectors = {
  getTotal,
  getItems,
  getPageNo,
};
