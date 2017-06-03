import { createAction, handleActions } from 'redux-actions';

/* Types */

const SET_FILTER_VALUE           = 'Filters/SET_FILTER_VALUE';

export const types = {
  SET_FILTER_VALUE,
};

/* Actions */

const setFilterValue = createAction(SET_FILTER_VALUE, (namespace, value) => ({ namespace, value }));

export const actions = {
  setFilterValue
};

/* Reducer */

const initialState = {};

const _setFilterValue = (state, action) => ({
  ...state,
  [action.payload.namespace]: action.payload.value
});

export const reducer      = handleActions({
  [SET_FILTER_VALUE]  : (state, action) => _setFilterValue(state, action),
}, initialState);

/* Selectors */

const getFilterValue = (state, namespace) => state[namespace];

export const selectors = {
  getFilterValue,
};
