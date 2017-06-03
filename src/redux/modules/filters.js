import { createAction, handleActions } from 'redux-actions';

/* Types */

const ADD_FILTER_VALUE  = 'Filters/ADD_FILTER_VALUE';
const SET_FILTER_VALUE  = 'Filters/SET_FILTER_VALUE';
const REMOVE_FILTER = 'Filters/REMOVE_FILTER';

export const types = {
  SET_FILTER_VALUE,
  REMOVE_FILTER
};

/* Actions */

const addFilterValue = createAction(ADD_FILTER_VALUE, (namespace, name, value) => ({ namespace, name, value }));
const setFilterValue = createAction(SET_FILTER_VALUE, (namespace, name, value) => ({ namespace, name, value }));
const removeFilter = createAction(REMOVE_FILTER, (namespace, name, idx) => ({ namespace, name, idx }));

export const actions = {
  addFilterValue,
  setFilterValue,
  removeFilter
};

/* Reducer */

const initialState = {};

const _addFilterValue = (state, action) => {
  const { namespace, name, value } = action.payload;
  const oldFilterNamespace = state[namespace] || {};
  const oldFilterValues = oldFilterNamespace[name] && oldFilterNamespace[name].values ? oldFilterNamespace[name].values : [];

  console.log(oldFilterValues, value);

  return {
    ...state,
    [namespace]: {
      ...oldFilterNamespace,
      [name]: {
        ...oldFilterNamespace[name],
        values: oldFilterValues.concat([value])
      }
    }
  };
};

const _setFilterValue = (state, action) => {
  const { namespace, name, value } = action.payload;
  const oldFilterNamespace = state[namespace] || {};

  return {
    ...state,
    [namespace]: {
      ...oldFilterNamespace,
      [name]: {
        ...oldFilterNamespace[name],
        values: [value],
      }
    }
  };
};

const _removeFilter = (state, action) => {
  const { namespace, name, idx } = action.payload;
  const oldFilterNamespace = state[namespace] || { value: [] };
  const oldFilterValues = oldFilterNamespace[name] && oldFilterNamespace[name].values ? oldFilterNamespace[name].values : [];
  const newFilterValues = oldFilterValues.slice(0, idx).concat(oldFilterValues.slice(idx + 1));

  return {
    ...state,
    [namespace]: {
      ...oldFilterNamespace,
      [name]: {
        ...oldFilterNamespace[name],
        values: newFilterValues,
      }
    }
  };
};

export const reducer = handleActions({
  [ADD_FILTER_VALUE]: (state, action) => _addFilterValue(state, action),
  [SET_FILTER_VALUE]: (state, action) => _setFilterValue(state, action),
  [REMOVE_FILTER]: (state, action) => _removeFilter(state, action)
}, initialState);

/* Selectors */
const getFilters = (state, namespace) => {
  const filters = !!state[namespace] ? state[namespace] : null;

  if (!filters) {
    return [];
  }

  return Object.keys(filters).map(filterName => ({
    name: filterName,
    ...filters[filterName],
  }));
};

const getLastFilterValue = (state, namespace, filterName) => {
  if (!!state[namespace] && !!state[namespace][filterName] &&
      !!state[namespace][filterName].values &&
      state[namespace][filterName].values.length > 0) {
    const values = state[namespace][filterName].values;
    return values[values.length - 1];
  } else {
    return undefined;
  }
};

export const selectors = {
  getFilters,
  getLastFilterValue,
};
