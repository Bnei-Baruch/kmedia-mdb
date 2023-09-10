import { createAction, handleActions } from 'redux-actions';

/* Types */

const ADD_FILTER    = 'bookmark/ADD_FILTER';
const DELETE_FILTER = 'bookmark/DELETE_FILTER';

export const types = {
  ADD_FILTER,
  DELETE_FILTER,
};

/* Actions */

const addFilter    = createAction(ADD_FILTER, (key, value) => ({ key, value }));
const deleteFilter = createAction(DELETE_FILTER);

export const actions = {
  addFilter,
  deleteFilter,
};

/* Reducer */
const onAdd = (draft, { key, value }) => {
  draft[key] = value;
  return draft;
};

const onDelete = (draft, key) => {
  draft[key] = null;
  return draft;
};

export const reducer = handleActions({
  [ADD_FILTER]: onAdd,
  [DELETE_FILTER]: onDelete,
}, { test: 'yes' });

/* Selectors */
const getAll   = state => state;
const getByKey = (state, key) => state[key];

export const selectors = {
  getAll,
  getByKey,
};
