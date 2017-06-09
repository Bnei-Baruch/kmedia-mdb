import { createAction, handleActions } from 'redux-actions';
import isEqual from 'lodash/isEqual';
import some from 'lodash/some';

/* Types */

const ADD_FILTER_VALUE  = 'Filters/ADD_FILTER_VALUE';
const SET_FILTER_VALUE  = 'Filters/SET_FILTER_VALUE';
const REMOVE_FILTER_VALUE = 'Filters/REMOVE_FILTER_VALUE';
const SET_HYDRATED_FILTER_VALUES = 'Filters/SET_HYDRATED_FILTER_VALUES';
const HYDRATE_FILTERS = 'Filters/HYDRATE_FILTERS';
const FILTERS_HYDRATED = 'Filters/FILTERS_HYDRATED';

export const types = {
  ADD_FILTER_VALUE,
  SET_FILTER_VALUE,
  REMOVE_FILTER_VALUE,
  SET_HYDRATED_FILTER_VALUES,
  HYDRATE_FILTERS,
  FILTERS_HYDRATED
};

/* Actions */

const addFilterValue = createAction(ADD_FILTER_VALUE, (namespace, name, value) => ({ namespace, name, value }));
const setFilterValue = createAction(SET_FILTER_VALUE, (namespace, name, value) => ({ namespace, name, value }));
const removeFilter = createAction(REMOVE_FILTER_VALUE, (namespace, name, value) => ({ namespace, name, value }));
const setHydratedFilterValues = createAction(
  SET_HYDRATED_FILTER_VALUES,
  (namespace, filters) => ({ namespace, filters })
);
const hydrateFilters = createAction(HYDRATE_FILTERS, (namespace, from = 'query') => ({ namespace, from }));
const filtersHydrated = createAction(FILTERS_HYDRATED, namespace => ({ namespace }));

export const actions = {
  addFilterValue,
  setFilterValue,
  removeFilter,
  setHydratedFilterValues,
  hydrateFilters,
  filtersHydrated
};

/* Reducer */

const initialState = {};

const _addFilterValue = (state, action) => {
  const { namespace, name, value } = action.payload;
  const oldFilterNamespace = state[namespace] || {};
  const oldFilterValues = oldFilterNamespace[name] && oldFilterNamespace[name].values ? oldFilterNamespace[name].values : [];
  if (value.length === 0 || some(oldFilterValues, (v) => isEqual(v, value))) {
    return state;
  }

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

  return {
    ...state,
    [namespace]: {
      ...oldNamespace,
      ...Object.keys(filters).reduce((acc, key) => {
        const value = filters[key];
        acc[key] = {
          ...oldNamespace[key],
          values: Array.isArray(value) ? value : [value]
        };
        return acc;
      }, {})
    }
  };
};

const _hydrateFilter = (state, action) => ({
  ...state,
  isHydrated: {
    ...state.isHydrated,
    [action.payload.namespace]: false
  }
});

const _filtersHydrated = (state, action) => ({
  ...state,
  isHydrated: {
    ...state.isHydrated,
    [action.payload.namespace]: true
  }
});

export const reducer = handleActions({
  [ADD_FILTER_VALUE]: (state, action) => _addFilterValue(state, action),
  [SET_FILTER_VALUE]: (state, action) => _setFilterValue(state, action),
  [REMOVE_FILTER_VALUE]: (state, action) => _removeFilterValue(state, action),
  [SET_HYDRATED_FILTER_VALUES]: (state, action) => _setHydratedFilterValues(state, action),
  [HYDRATE_FILTERS]: _hydrateFilters,
  [FILTERS_HYDRATED]: _filtersHydrated
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

const getIsHydrated = (state, namespace) => !!state.isHydrated && !!state.isHydrated[namespace];

export const selectors = {
  getFilters,
  getLastFilterValue,
  getIsHydrated
};
