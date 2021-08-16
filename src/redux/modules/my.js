import { createAction } from 'redux-actions';

import { handleActions } from './settings';
import { MY_NAMESPACES } from '../../helpers/consts';

/* Types */
const SET_PAGE = 'My/SET_PAGE';

const FETCH         = 'My/FETCH';
const FETCH_SUCCESS = 'My/FETCH_SUCCESS';
const FETCH_FAILURE = 'My/FETCH_FAILURE';

const ADD         = 'My/ADD';
const ADD_SUCCESS = 'My/ADD_SUCCESS';

const REMOVE         = 'My/REMOVE';
const REMOVE_SUCCESS = 'My/REMOVE_SUCCESS';

export const types = {
  SET_PAGE,
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,

  ADD,
  ADD_SUCCESS,

  REMOVE,
  REMOVE_SUCCESS,
};

/* Actions */

const setPage = createAction(SET_PAGE, (namespace, pageNo) => ({ namespace, pageNo }));

const fetch        = createAction(FETCH, (namespace, params) => ({ namespace, ...params }));
const fetchSuccess = createAction(FETCH_SUCCESS);
const fetchFailure = createAction(FETCH_FAILURE);

const add        = createAction(ADD, (namespace, params) => ({ namespace, ...params }));
const addSuccess = createAction(ADD_SUCCESS);

const remove        = createAction(REMOVE, (namespace, params) => ({ namespace, ...params }));
const removeSuccess = createAction(REMOVE_SUCCESS);

export const actions = {
  setPage,

  fetch,
  fetchSuccess,
  fetchFailure,

  add,
  addSuccess,

  remove,
  removeSuccess,

};

/* Reducer */
const initialState = MY_NAMESPACES.reduce((acc, n) => {
  acc[n] = {
    items: [],
    wip: false,
    total: 0,
    errors: null
  };
  return acc;
}, {});

const onSetPage = (draft, { namespace, pageNo }) => {
  draft[namespace].pageNo = pageNo;
};

const onFetch = (draft, { namespace }) => {
  draft[namespace].wip    = true;
  draft[namespace].errors = false;
  draft[namespace].total  = 0;
  return draft;
};

const onFetchSuccess = (draft, { namespace, items = [], total }) => {
  draft[namespace].items  = items || [];
  draft[namespace].total  = total;
  draft[namespace].wip    = false;
  draft[namespace].errors = false;
  return draft;
};

const onFetchFailure = (draft, { namespace }) => {
  draft[namespace].wip    = false;
  draft[namespace].errors = true;
  return draft;
};

const onAddSuccess = (draft, { namespace, items }) => {
  draft[namespace].items  = draft[namespace].items.concat(items);
  draft[namespace].total  = draft[namespace].total + items.length;
  draft[namespace].wip    = false;
  draft[namespace].errors = false;
  return draft;
};

const onRemoveSuccess = (draft, { namespace, ids }) => {
  draft[namespace].items  = draft[namespace].items.filter(a => !ids.includes(a.id));
  draft[namespace].total  = draft[namespace].total - ids.length;
  draft[namespace].wip    = false;
  draft[namespace].errors = false;
  return draft;
};

export const reducer = handleActions({
  [SET_PAGE]: onSetPage,

  [FETCH]: onFetch,
  [FETCH_SUCCESS]: onFetchSuccess,
  [FETCH_FAILURE]: onFetchFailure,

  [ADD_SUCCESS]: onAddSuccess,
  [REMOVE_SUCCESS]: onRemoveSuccess,
}, initialState);

/* Selectors */
const getItems  = (state, namespace) => state[namespace].items;
const getWIP    = (state, namespace) => state[namespace].wip;
const getErr    = (state, namespace) => state[namespace].errors;
const getPageNo = (state, namespace) => state[namespace].pageNo;
const getTotal  = (state, namespace) => state[namespace].total;

export const selectors = {
  getItems,
  getWIP,
  getErr,
  getPageNo,
  setPage,
  getTotal,
};
