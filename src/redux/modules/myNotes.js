import { createAction } from 'redux-actions';

import { handleActions } from './settings';

/* Types */
const FETCH                 = 'MyNotes/FETCH';
const FETCH_SUCCESS         = 'MyNotes/FETCH_SUCCESS';
const FETCH_FAILURE         = 'MyNotes/FETCH_FAILURE';
const ADD_SERVER            = 'MyNotes/ADD_SERVER';
const ADD_SERVER_SUCCESS    = 'MyNotes/ADD_SERVER_SUCCESS';
const EDIT_SERVER           = 'MyNotes/EDIT_SERVER';
const EDIT_SERVER_SUCCESS   = 'MyNotes/EDIT_SERVER_SUCCESS';
const REMOVE_SERVER         = 'MyNotes/REMOVE_SERVER';
const REMOVE_SERVER_SUCCESS = 'MyNotes/REMOVE_SERVER_SUCCESS';

const SET_SELECTED = 'MyNotes/SET_SELECTED';
const SET_STATUS   = 'MyNotes/SET_STATUS';

export const types = {
  FETCH,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  ADD_SERVER,
  ADD_SERVER_SUCCESS,
  EDIT_SERVER,
  EDIT_SERVER_SUCCESS,
  REMOVE_SERVER,
  REMOVE_SERVER_SUCCESS,
};

/* Actions */

const fetch               = createAction(FETCH);
const fetchSuccess        = createAction(FETCH_SUCCESS);
const fetchFailure        = createAction(FETCH_FAILURE);
const addServer           = createAction(ADD_SERVER, (content, properties) => ({ content, ...properties }));
const addServerSuccess    = createAction(ADD_SERVER_SUCCESS);
const editServer          = createAction(EDIT_SERVER, (content, id) => ({ content, id }));
const editServerSuccess   = createAction(EDIT_SERVER_SUCCESS);
const removeServer        = createAction(REMOVE_SERVER);
const removeServerSuccess = createAction(REMOVE_SERVER_SUCCESS);

const setSelected = createAction(SET_SELECTED);
const setStatus   = createAction(SET_STATUS);

export const actions = {
  fetch,
  fetchSuccess,
  fetchFailure,
  addServer,
  addServerSuccess,
  editServer,
  editServerSuccess,
  removeServer,
  removeServerSuccess,

  setSelected,
  setStatus,
};

export const NOTE_STATUS = {
  edit: 1,
  remove: 2,
  none: 3,
  modal: 4,
  editModal: 5,
};

/* Reducer */
const initialNamespaces = {
  ids: [],
  byId: {},
  wip: false,
  errors: null,
  noteStatus: NOTE_STATUS.none,
  selected: null

};

const onFetch = draft => {
  draft.wip    = true;
  draft.errors = false;
  draft.ids    = [];
  draft.byId   = {};
};

const onFetchSuccess = (draft, { items }) => {
  draft.wip    = false;
  draft.errors = false;

  draft.ids  = [];
  draft.byId = {};
  Object.values(items).forEach(x => {
    draft.ids.push(x.id);
    draft.byId[x.id] = x;
  });
};

const onFetchFailure = draft => {
  draft.wip    = false;
  draft.errors = true;
};

const onAddServerSuccess = (state, { item }) => {
  state.byId[item.id] = item;
  state.ids           = [item.id, ...state.ids];
  state.wip           = false;
  state.errors        = false;
  state.selected      = null;
  state.noteStatus    = NOTE_STATUS.none;

};

const onEditServerSuccess = (state, { item }) => {
  state.byId[item.id] = item;
  state.wip           = false;
  state.errors        = false;
  state.selected      = null;
  state.noteStatus    = NOTE_STATUS.none;
};

const onRemoveServerSuccess = (state, id) => {
  state.ids        = state.ids.filter(k => k !== id);
  state.byId[id]   = null;
  state.deleted    = true;
  state.wip        = false;
  state.errors     = false;
  state.selected   = null;
  state.noteStatus = NOTE_STATUS.none;
};

export const reducer = handleActions({
  [FETCH]: onFetch,
  [FETCH_SUCCESS]: onFetchSuccess,
  [FETCH_FAILURE]: onFetchFailure,
  [ADD_SERVER_SUCCESS]: onAddServerSuccess,
  [EDIT_SERVER_SUCCESS]: onEditServerSuccess,
  [REMOVE_SERVER_SUCCESS]: onRemoveServerSuccess,

  [SET_SELECTED]: (state, payload) => state.selected = payload,
  [SET_STATUS]: (state, payload) => state.noteStatus = payload ?? NOTE_STATUS.none,
}, initialNamespaces);

/* Selectors */
const getList     = state => state.ids;
const getById     = state => state.byId;
const getWIP      = state => state.wip;
const getErr      = state => state.errors;
const getStatus   = state => state.noteStatus;
const getSelected = state => state.selected;

export const selectors = {
  getList,
  getById,
  getWIP,
  getErr,
  getStatus,
  getSelected,
};
