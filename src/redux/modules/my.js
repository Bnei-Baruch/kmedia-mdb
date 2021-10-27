import { createAction } from 'redux-actions';

import { handleActions } from './settings';
import {
  MY_NAMESPACE_REACTIONS,
  MY_NAMESPACES
} from '../../helpers/consts';
import { getMyItemKey } from '../../helpers/my';
import MY_REACTIONS_TYPES from 'lodash';

/* Types */
const SET_PAGE = 'My/SET_PAGE';

const FETCH         = 'My/FETCH';
const FETCH_SUCCESS = 'My/FETCH_SUCCESS';
const FETCH_FAILURE = 'My/FETCH_FAILURE';

const FETCH_ONE         = 'My/FETCH_ONE';
const FETCH_ONE_SUCCESS = 'My/FETCH_ONE_SUCCESS';

const ADD         = 'My/ADD';
const ADD_SUCCESS = 'My/ADD_SUCCESS';

const EDIT         = 'My/EDIT';
const EDIT_SUCCESS = 'My/EDIT_SUCCESS';

const REMOVE         = 'My/REMOVE';
const REMOVE_SUCCESS = 'My/REMOVE_SUCCESS';

const SET_DELETED = 'My/SET_DELETED';

const REACTION_COUNT         = 'My/REACTION_COUNT';
const REACTION_COUNT_SUCCESS = 'My/REACTION_COUNT_SUCCESS';

export const types = {
  SET_PAGE,

  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,

  FETCH_ONE,
  FETCH_ONE_SUCCESS,

  ADD,
  ADD_SUCCESS,

  EDIT,
  EDIT_SUCCESS,

  REMOVE,
  REMOVE_SUCCESS,

  SET_DELETED,

  REACTION_COUNT,
  REACTION_COUNT_SUCCESS,
};

/* Actions */

const setPage = createAction(SET_PAGE, (namespace, pageNo) => ({ namespace, pageNo }));

const fetch        = createAction(FETCH, (namespace, params) => ({ namespace, ...params }));
const fetchSuccess = createAction(FETCH_SUCCESS);
const fetchFailure = createAction(FETCH_FAILURE);

const fetchOne        = createAction(FETCH_ONE, (namespace, params) => ({ namespace, ...params }));
const fetchOneSuccess = createAction(FETCH_ONE_SUCCESS, (namespace, params) => ({ namespace, ...params }));

const add        = createAction(ADD, (namespace, params) => ({ namespace, ...params }));
const addSuccess = createAction(ADD_SUCCESS);

const edit        = createAction(EDIT, (namespace, params) => ({ namespace, ...params }));
const editSuccess = createAction(EDIT_SUCCESS);

const remove        = createAction(REMOVE, (namespace, params) => ({ namespace, ...params }));
const removeSuccess = createAction(REMOVE_SUCCESS);

const setDeleted = createAction(SET_DELETED, (namespace, deleted) => ({ namespace, deleted }));

const reactionsCount        = createAction(REACTION_COUNT);
const reactionsCountSuccess = createAction(REACTION_COUNT_SUCCESS);

export const actions = {
  setPage,

  fetch,
  fetchSuccess,
  fetchFailure,

  fetchOne,
  fetchOneSuccess,

  add,
  addSuccess,

  edit,
  editSuccess,

  remove,
  removeSuccess,

  setDeleted,

  reactionsCount,
  reactionsCountSuccess,

};

/* Reducer */
const initialNamespaces = MY_NAMESPACES.reduce((acc, n) => {
  acc[n] = {
    keys: [],
    byKey: {},
    total: null,
    wip: false,
    errors: null,
    pageNo: 0,
    deleted: false
  };
  return acc;
}, {});

const initialCount = MY_REACTIONS_TYPES.reduce((acc, t) => {
  acc[t] = 0;
  return acc;
}, {});

const onSetPage = (draft, { namespace, pageNo }) => draft[namespace].pageNo = pageNo;

const onFetch = (draft, { namespace }) => {
  draft[namespace].total  = null;
  draft[namespace].wip    = true;
  draft[namespace].errors = false;
  return draft;
};

const onFetchSuccess = (draft, { namespace, items = [], total, uids }) => {
  draft[namespace].total  = total;
  draft[namespace].wip    = false;
  draft[namespace].errors = false;

  const keys = [];
  Object.values(items).forEach(x => {
    const { key } = getMyItemKey(namespace, x);
    keys.push(key);
    draft[namespace].byKey[key] = x;
  });

  draft[namespace].keys = keys;
  return draft;
};

const onFetchFailure = (draft, { namespace }) => {
  draft[namespace].wip    = false;
  draft[namespace].errors = true;
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
  draft[namespace].total      = draft[namespace].total + 1;
  if (namespace === MY_NAMESPACE_REACTIONS) ++draft.reactionsCount[item.kind];

  draft[namespace].wip    = false;
  draft[namespace].errors = false;

  return draft;
};

const onEditSuccess = (draft, { namespace, item }) => {
  const { key }               = getMyItemKey(namespace, item);
  draft[namespace].byKey[key] = item;

  draft[namespace].wip    = false;
  draft[namespace].errors = false;
  return draft;
};

const onRemoveSuccess = (draft, { namespace, key }) => {
  draft[namespace].keys    = draft[namespace].keys.filter(k => k === key);
  draft[namespace].deleted = true;
  --draft[namespace].total;
  if (namespace === MY_NAMESPACE_REACTIONS) --draft.reactionsCount[key];

  draft[namespace].wip    = false;
  draft[namespace].errors = false;
  return draft;
};

const onSetDeleted = (draft, { namespace, deleted }) => {
  draft[namespace].deleted = deleted;
  return draft;
};

const onReactionsCountSuccess = (draft, data) => {
  Object.assign(draft.reactionsCount, data);
  return draft;
};

export const reducer = handleActions({
  [SET_PAGE]: onSetPage,

  [FETCH]: onFetch,
  [FETCH_SUCCESS]: onFetchSuccess,
  [FETCH_FAILURE]: onFetchFailure,

  [FETCH_ONE]: onFetchOne,
  [FETCH_ONE_SUCCESS]: onFetchOneSuccess,

  [ADD_SUCCESS]: onAddSuccess,
  [EDIT_SUCCESS]: onEditSuccess,
  [REMOVE_SUCCESS]: onRemoveSuccess,

  [SET_DELETED]: onSetDeleted,

  [REACTION_COUNT_SUCCESS]: onReactionsCountSuccess,
}, { ...initialNamespaces, reactionsCount: initialCount });

/* Selectors */
const getList      = (state, namespace) => state[namespace].keys.map(key => getItemByKey(state, namespace, key));
const getItemByKey = (state, namespace, key) => state[namespace].byKey[key];

const getWIP            = (state, namespace) => state[namespace].wip;
const getErr            = (state, namespace) => state[namespace].errors;
const getDeleted        = (state, namespace) => state[namespace].deleted;
const getPageNo         = (state, namespace) => state[namespace].pageNo;
const getTotal          = (state, namespace) => state[namespace].total;
const getReactionsCount = (state, kind) => state.reactionsCount?.[kind];

export const selectors = {
  getList,
  getItemByKey,
  getWIP,
  getErr,
  getDeleted,
  getPageNo,
  getTotal,
  getReactionsCount,
};
