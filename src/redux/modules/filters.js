import { createAction, handleActions } from 'redux-actions';

/* Types */

const SET_FILTER_VALUE           = 'Filters/SET_FILTER_VALUE';

export const types = {
  SET_FILTER_VALUE,
};

/* Actions */

const setFilterValue = createAction(SET_FILTER_VALUE, (namespace, name, value) => ({ namespace, name, value }));

export const actions = {
  setFilterValue
};

/* Reducer */

const initialState = {};

const _setFilterValue = (state, action) => {
  const { namespace, name, value } = action.payload;
  const oldFilterNamespace = state[namespace];

  return {
    ...state,
    [namespace]: {
      ...oldFilterNamespace,
      [name]: value
    }
  };
};

export const reducer      = handleActions({
  [SET_FILTER_VALUE]  : (state, action) => _setFilterValue(state, action),
}, initialState);

/* Selectors */

const getFilterValue = (state, namespace, name) => (state[namespace] ? state[namespace][name] : undefined);

export const selectors = {
  getFilterValue,
};
