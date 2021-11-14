import { createAction } from 'redux-actions';

import { handleActions } from './settings';
import {
  MY_NAMESPACE_PLAYLISTS,
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
const fetchOneSuccess = createAction(FETCH_ONE_SUCCESS);

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
    total: 0,
    wip: false,
    errors: null,
    pageNo: 0,
    deleted: false
  };
  return acc;
}, {});

const onSetPage = (draft, { namespace, pageNo }) => draft[namespace].pageNo = pageNo;

const onFetch = (draft, { namespace, addToList = true }) => {
  addToList && (draft[namespace].total = 0);
  draft[namespace].wip    = true;
  draft[namespace].errors = false;
  return draft;
};

const onFetchSuccess = (draft, { namespace, addToList = true, items, total }) => {
  draft[namespace].total  = total;
  draft[namespace].wip    = false;
  draft[namespace].errors = false;

  const keys = addToList ? [] : draft[namespace].keys;
  Object.values(items).forEach(x => {
    const { key } = getMyItemKey(namespace, x);
    addToList && keys.push(key);
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
  draft[namespace].keys.unshift(key);
  draft[namespace].total = draft[namespace].total + 1;
  if (namespace === MY_NAMESPACE_REACTIONS)
    draft.reactionsCount[key] = draft.reactionsCount[key] ? draft.reactionsCount[key] + 1 : 1;

  draft[namespace].wip    = false;
  draft[namespace].errors = false;

  return draft;
};

const onEditSuccess = (draft, { namespace, item, changeItems }) => {
  const { key } = getMyItemKey(namespace, item);
  const byKey   = { ...draft[namespace].byKey[key], ...item };
  if (namespace === MY_NAMESPACE_PLAYLISTS && !changeItems) {
    byKey.items = draft[namespace].byKey[key].items;
  }

  draft[namespace].byKey[key] = byKey;

  draft[namespace].wip    = false;
  draft[namespace].errors = false;
  return draft;
};

const onRemoveSuccess = (draft, { namespace, item }) => {
  const { key }               = getMyItemKey(namespace, item);
  draft[namespace].keys       = draft[namespace].keys.filter(k => k !== key);
  draft[namespace].byKey[key] = null;
  draft[namespace].deleted    = true;
  draft[namespace].total      = draft[namespace].total - 1;
  if (namespace === MY_NAMESPACE_REACTIONS)
    draft.reactionsCount[key] = draft.reactionsCount[key] ? draft.reactionsCount[key] - 1 : 0;

  draft[namespace].wip    = false;
  draft[namespace].errors = false;
  return draft;
};

const onSetDeleted = (draft, { namespace, deleted }) => {
  draft[namespace].deleted = deleted;
  return draft;
};

const onReactionsCountSuccess = (draft, data) => {
  const byKey = data.reduce((acc, x) => {
    const { key } = getMyItemKey(MY_NAMESPACE_REACTIONS, x);
    acc[key]      = x.total;
    return acc;
  }, draft.reactionsCount);
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
}, { reactionsCount: {}, ...initialNamespaces });

/* Selectors */
const getList      = (state, namespace) => state[namespace].keys.map(key => getItemByKey(state, namespace, key));
const getItemByKey = (state, namespace, key) => state[namespace].byKey[key];

const getWIP            = (state, namespace) => state[namespace].wip;
const getErr            = (state, namespace) => state[namespace].errors;
const getDeleted        = (state, namespace) => state[namespace].deleted;
const getPageNo         = (state, namespace) => state[namespace].pageNo;
const getTotal          = (state, namespace) => state[namespace].total;
const getReactionsCount = (state, key) => state.reactionsCount[key];

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
