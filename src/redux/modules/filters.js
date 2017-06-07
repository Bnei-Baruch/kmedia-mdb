import { createAction, handleActions } from 'redux-actions';

/* Types */

const ADD_FILTER_VALUE  = 'Filters/ADD_FILTER_VALUE';
const SET_FILTER_VALUE  = 'Filters/SET_FILTER_VALUE';
const REMOVE_FILTER_VALUE = 'Filters/REMOVE_FILTER_VALUE';
const SET_HYDRATED_FILTER_VALUES = 'Filters/SET_HYDRATED_FILTER_VALUES';
const HYDRATE = 'Filters/HYDRATE';

export const types = {
  ADD_FILTER_VALUE,
  SET_FILTER_VALUE,
  REMOVE_FILTER_VALUE,
  SET_HYDRATED_FILTER_VALUES,
  HYDRATE,
};

/* Actions */

const addFilterValue = createAction(ADD_FILTER_VALUE, (namespace, name, value) => ({ namespace, name, value }));
const setFilterValue = createAction(SET_FILTER_VALUE, (namespace, name, value) => ({ namespace, name, value }));
const removeFilter = createAction(REMOVE_FILTER_VALUE, (namespace, name, value) => ({ namespace, name, value }));
const setHydratedFilterValues = createAction(
  SET_HYDRATED_FILTER_VALUES,
  (namespace, filters) => ({ namespace, filters })
);
const hydrateFilters = createAction(HYDRATE, (namespace, from = 'query') => ({ namespace, from }));

export const actions = {
  addFilterValue,
  setFilterValue,
  removeFilter,
  setHydratedFilterValues,
  hydrateFilters
};

/* Reducer */

const initialState = {};

const _addFilterValue = (state, action) => {
  const { namespace, name, value } = action.payload;
  const oldFilterNamespace = state[namespace] || {};
  const oldFilterValues = oldFilterNamespace[name] && oldFilterNamespace[name].values ? oldFilterNamespace[name].values : [];

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

const _removeFilterValue = (state, action) => {
  const { namespace, name, value } = action.payload;
  const oldFilterNamespace = state[namespace] || {};
  const oldFilterValues = oldFilterNamespace[name] && oldFilterNamespace[name].values ? oldFilterNamespace[name].values : [];
  const idx = oldFilterValues.indexOf(value);

  // eslint-disable-next-line no-bitwise
  if (!~idx) {
    return state;
  }

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

const _setHydratedFilterValues = (state, action) => {
  const { namespace, filters } = action.payload;
  const oldNamespace = state[namespace] || {};

  console.log(filters);
  return {
    ...state,
    [namespace]: {
      ...oldNamespace,
      ...Object.keys(filters).reduce((acc, key) => {
        acc[key] = {
          ...oldNamespace[key],
          values: filters[key]
        };
        return acc;
      }, {})
    }
  };
};

export const reducer = handleActions({
  [ADD_FILTER_VALUE]: (state, action) => _addFilterValue(state, action),
  [SET_FILTER_VALUE]: (state, action) => _setFilterValue(state, action),
  [REMOVE_FILTER_VALUE]: (state, action) => _removeFilterValue(state, action),
  [SET_HYDRATED_FILTER_VALUES]: (state, action) => _setHydratedFilterValues(state, action)
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
  }

  return undefined;
};

export const selectors = {
  getFilters,
  getLastFilterValue
};
