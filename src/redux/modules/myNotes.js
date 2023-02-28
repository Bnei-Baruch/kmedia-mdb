import { createAction } from 'redux-actions';

import { handleActions } from './settings';

/* Types */
const FETCH         = 'MyNotes/FETCH';
const FETCH_SUCCESS = 'MyNotes/FETCH_SUCCESS';
const FETCH_FAILURE = 'MyNotes/FETCH_FAILURE';

const ADD         = 'MyNotes/ADD';
const ADD_SUCCESS = 'MyNotes/ADD_SUCCESS';

const EDIT         = 'MyNotes/EDIT';
const EDIT_SUCCESS = 'MyNotes/EDIT_SUCCESS';

const REMOVE         = 'MyNotes/REMOVE';
const REMOVE_SUCCESS = 'MyNotes/REMOVE_SUCCESS';

export const types = {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,

  ADD,
  ADD_SUCCESS,

  EDIT,
  EDIT_SUCCESS,

  REMOVE,
  REMOVE_SUCCESS,
};

/* Actions */

const fetch         = createAction(FETCH);
const fetchSuccess  = createAction(FETCH_SUCCESS);
const fetchFailure  = createAction(FETCH_FAILURE);
const add           = createAction(ADD, (content, properties) => ({ content, ...properties }));
const addSuccess    = createAction(ADD_SUCCESS);
const edit          = createAction(EDIT, (content, id) => ({ content, id }));
const editSuccess   = createAction(EDIT_SUCCESS);
const remove        = createAction(REMOVE);
const removeSuccess = createAction(REMOVE_SUCCESS);

export const actions = {
  fetch,
  fetchSuccess,
  fetchFailure,

  add,
  addSuccess,

  edit,
  editSuccess,

  remove,
  removeSuccess,
};

/* Reducer */
const initialNamespaces = {
  ids: [],
  byId: {},
  wip: false,
  errors: null
};

const onFetch = draft => {
  draft.ids    = [];
  draft.wip    = true;
  draft.errors = false;
  draft.byId   = {};
};

const onFetchSuccess = (draft, { items }) => {
  draft.wip    = false;
  draft.errors = false;

  Object.values(items).forEach(x => {
    draft.ids.push(x.id);
    draft.byId[x.id] = x;
  });
};

const onFetchFailure = draft => {
  draft.wip    = false;
  draft.errors = true;
};

const onAddSuccess = (draft, { item }) => {
  draft.byId[item.id] = item;
  draft.ids           = [item.id, ...draft.ids];
  draft.wip           = false;
  draft.errors        = false;
};

const onEditSuccess = (draft, { item }) => {
  draft.byId[item.id] = item;
  draft.wip           = false;
  draft.errors        = false;
};

const onRemoveSuccess = (draft, id) => {
  draft.ids      = draft.ids.filter(k => k !== id);
  draft.byId[id] = null;
  draft.deleted  = true;
  draft.wip      = false;
  draft.errors   = false;
};

export const reducer = handleActions({
  [FETCH]: onFetch,
  [FETCH_SUCCESS]: onFetchSuccess,
  [FETCH_FAILURE]: onFetchFailure,

  [ADD_SUCCESS]: onAddSuccess,
  [EDIT_SUCCESS]: onEditSuccess,
  [REMOVE_SUCCESS]: onRemoveSuccess,
}, initialNamespaces);

/* Selectors */
const getList = state => state.ids;
const getById = (state, id) => {
  return state.byId[id];
}
const getWIP  = state => state.wip;
const getErr  = state => state.errors;

export const selectors = {
  getList,
  getById,
  getWIP,
  getErr,
};
