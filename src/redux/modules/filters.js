import { createAction, handleActions } from 'redux-actions';
import isFunction from 'lodash/isFunction';
import isEqual from 'lodash/isEqual';

/* Types */

const STOP_EDITING_FILTER  = 'Filters/STOP_EDITING_FILTER';
const CLOSE_ACTIVE_FILTER  = 'Filters/CLOSE_ACTIVE_FILTER';
const EDIT_NEW_FILTER      = 'Filters/EDIT_NEW_FILTER';
const EDIT_EXISTING_FILTER = 'Filters/EDIT_EXISTING_FILTER';

const ADD_FILTER_VALUE           = 'Filters/ADD_FILTER_VALUE';
const SET_FILTER_VALUE           = 'Filters/SET_FILTER_VALUE';
const REMOVE_FILTER_VALUE        = 'Filters/REMOVE_FILTER_VALUE';
const RESET_FILTER               = 'Filters/RESET_FILTER';
const SET_HYDRATED_FILTER_VALUES = 'Filters/SET_HYDRATED_FILTER_VALUES';
const HYDRATE_FILTERS            = 'Filters/HYDRATE_FILTERS';
const FILTERS_HYDRATED           = 'Filters/FILTERS_HYDRATED';

export const types = {
  STOP_EDITING_FILTER,
  CLOSE_ACTIVE_FILTER,
  EDIT_NEW_FILTER,
  EDIT_EXISTING_FILTER,

  ADD_FILTER_VALUE,
  SET_FILTER_VALUE,
  REMOVE_FILTER_VALUE,
  RESET_FILTER,
  SET_HYDRATED_FILTER_VALUES,
  HYDRATE_FILTERS,
  FILTERS_HYDRATED
};

/* Actions */

const stopEditingFilter  = createAction(STOP_EDITING_FILTER, (namespace, name) => ({ namespace, name }));
const closeActiveFilter  = createAction(CLOSE_ACTIVE_FILTER, (namespace, name) => ({ namespace, name }));
const editNewFilter      = createAction(EDIT_NEW_FILTER, (namespace, name) => ({ namespace, name }));
const editExistingFilter = createAction(EDIT_EXISTING_FILTER, (namespace, name, index = 0) => ({
  namespace,
  name,
  index
}));

const addFilterValue    = createAction(ADD_FILTER_VALUE, (namespace, name, value) => ({
  namespace,
  name,
  value
}));
const setFilterValue    = createAction(SET_FILTER_VALUE, (namespace, name, value, index) => ({
  namespace,
  name,
  value,
  index
}));
const removeFilterValue = createAction(REMOVE_FILTER_VALUE, (namespace, name, value) => ({
  namespace,
  name,
  value
}));
const resetFilter       = createAction(RESET_FILTER, (namespace, name) => ({
  namespace,
  name
}));

const setHydratedFilterValues = createAction(
  SET_HYDRATED_FILTER_VALUES,
  (namespace, filters) => ({ namespace, filters })
);
const hydrateFilters          = createAction(HYDRATE_FILTERS, namespace => ({ namespace }));
const filtersHydrated         = createAction(FILTERS_HYDRATED, namespace => ({ namespace }));

export const actions = {
  stopEditingFilter,
  closeActiveFilter,
  editNewFilter,
  editExistingFilter,

  addFilterValue,
  setFilterValue,
  removeFilterValue,
  resetFilter,
  setHydratedFilterValues,
  hydrateFilters,
  filtersHydrated
};

/* Reducer */

const initialState = {};

const setFilterState = (state, namespace, name, newFilterStateReducer) => {
  const oldNamespace = state[namespace] || { [name]: {}, activeFilter: '' };
  if (!oldNamespace[name]) {
    oldNamespace[name] = {};
  }
  const newFilterState = isFunction(newFilterStateReducer)
    ? newFilterStateReducer(oldNamespace[name])
    : newFilterStateReducer;

  if (oldNamespace[name] === newFilterState) {
    return state;
  }

  return {
    ...state,
    [namespace]: {
      ...oldNamespace,
      [name]: {
        ...oldNamespace[name],
        ...newFilterState
      }
    }
  };
};

const $$stopEditing = (state, action) => {
  const { namespace, name } = action.payload;
  return setFilterState(state, namespace, name, {
    editingExistingValue: false,
    activeValueIndex: null
  });
};

const $$closeActiveFilter = (state, action) => {
  const newState = $$stopEditing(state, action);

  newState[action.payload.namespace].activeFilter = '';
  return newState;
};

const $$editNewFilter = (state, action) => {
  const { namespace, name } = action.payload;

  const newState                   = setFilterState(state, namespace, name, filterState => ({
    activeValueIndex: Array.isArray(filterState.values) && filterState.values.length > 0 ? filterState.length - 1 : 0,
    editingExistingValue: false,
  }));
  newState[namespace].activeFilter = name;
  return newState;
};

const $$editExistingFilter = (state, action) => {
  const { namespace, name, index } = action.payload;
  const newState                   = setFilterState(state, namespace, name, {
    activeValueIndex: index,
    editingExistingValue: true
  });

  newState[namespace].activeFilter = name;
  return newState;
};

const $$addFilterValue = (state, action) => {
  const { namespace, name, value } = action.payload;

  return setFilterState(state, namespace, name, (filterState) => {
    const values = filterState.values || [];
    if (value.length === 0 || values.some(v => isEqual(v, value))) {
      return filterState;
    }

    const newValues = values.concat([value]);

    return {
      values: newValues,
      activeValueIndex: null
    };
  });
};

const $$setFilterValue = (state, action) => {
  const { namespace, name, value, index } = action.payload;
  return setFilterState(state, namespace, name, (filterState) => {
    if (typeof index === 'undefined') {
      return { values: [value] };
    }

    const values = filterState.values || [];
    return {
      values: values.slice(0, index).concat([value]).concat(values.slice(index + 1)),
      activeValueIndex: index
    };
  });
};

const $$removeFilterValue = (state, action) => {
  const { namespace, name, value } = action.payload;

  return setFilterState(state, namespace, name, (filterState) => {
    const values = filterState.values || [];
    const idx    = values.indexOf(value);

    // eslint-disable-next-line no-bitwise
    if (!~idx) {
      return filterState;
    }

    const newValues = values.slice(0, idx).concat(values.slice(idx + 1));

    return { values: newValues };
  });
};

const $$resetFilter = (state, action) => {
  const { namespace, name } = action.payload;

  return setFilterState(state, namespace, name, (filterState) => {
    return { values: [] };
  });
};

const $$setHydratedFilterValues = (state, action) => {
  const { namespace, filters } = action.payload;
  const oldNamespace           = state[namespace] || {};

  return {
    ...state,
    isHydrated: {
      ...state.isHydrated,
      [action.payload.namespace]: true
    },
    [namespace]: {
      // ...oldNamespace,  If we're hydrating then we need a fresh state
      ...Object.keys(filters).reduce((acc, name) => {
        const value = filters[name];
        acc[name]   = {
          ...oldNamespace[name],
          values: Array.isArray(value) ? value : [value]
        };
        return acc;
      }, {})
    }
  };
};

const $$hydrateFilters = (state, action) => ({
  ...state,
  isHydrated: {
    ...state.isHydrated,
    [action.payload.namespace]: false
  }
});

const $$filtersHydrated = (state, action) => ({
  ...state,
  isHydrated: {
    ...state.isHydrated,
    [action.payload.namespace]: false
  }
});

export const reducer = handleActions({
  [STOP_EDITING_FILTER]: $$stopEditing,
  [CLOSE_ACTIVE_FILTER]: $$closeActiveFilter,
  [EDIT_NEW_FILTER]: $$editNewFilter,
  [EDIT_EXISTING_FILTER]: $$editExistingFilter,

  [ADD_FILTER_VALUE]: $$addFilterValue,
  [SET_FILTER_VALUE]: $$setFilterValue,
  [REMOVE_FILTER_VALUE]: $$removeFilterValue,
  [RESET_FILTER]: $$resetFilter,
  [SET_HYDRATED_FILTER_VALUES]: $$setHydratedFilterValues,
  [HYDRATE_FILTERS]: $$hydrateFilters,
  [FILTERS_HYDRATED]: $$filtersHydrated
}, initialState);

/* Selectors */
const getFilters = (state, namespace) => {
  const filters = state[namespace] ? state[namespace] : null;

  if (!filters) {
    return [];
  }

  /*return Object.keys(filters).filter(filterName => filterName !== 'activeFilter').map(filterName => ({
    name: filterName,
    ...filters[filterName],
  }));*/

  return Object.keys(filters).filter(filterName => filterName !== 'activeFilter' 
    && filters[filterName].values && filters[filterName].values.length > 0).map(filterName => ({
    name: filterName,
    ...filters[filterName],
  }));
  
};

const getFilterAllValues = (state, namespace, name) =>
  state[namespace] &&
  state[namespace][name] &&
  state[namespace][name].values;

const getFilterValue = (state, namespace, name, index = 0) =>
  getFilterAllValues(state, namespace, name, index) &&
  state[namespace][name].values[index];

const getLastFilterValue = (state, namespace, name) => {
  if (
    state[namespace] &&
    state[namespace][name] &&
    state[namespace][name].values &&
    state[namespace][name].values.length > 0
  ) {
    const values = state[namespace][name].values;
    return values[values.length - 1];
  }

  return undefined;
};

const getActiveValueIndex = (state, namespace, name) =>
  state[namespace] &&
  state[namespace][name] &&
  state[namespace][name].activeValueIndex;

const getActiveValue = (state, namespace, name) =>
  getFilterValue(state, namespace, name, getActiveValueIndex(state, namespace, name)) ||
  getLastFilterValue(state, namespace, name);

const getIsEditingExistingFilter = (state, namespace, name) =>
  state[namespace] &&
  state[namespace][name] &&
  state[namespace][name].editingExistingValue;

const getIsHydrated = (state, namespace) => !!state.isHydrated && !!state.isHydrated[namespace];

const getActiveFilter = (state, namespace) => (
  (state[namespace] && state[namespace].activeFilter)
    ? state[namespace].activeFilter
    : ''
);

export const selectors = {
  getFilters,
  getFilterValue,
  getFilterAllValues,
  getLastFilterValue,
  getActiveValueIndex,
  getActiveValue,
  getIsEditingExistingFilter,
  getIsHydrated,
  getActiveFilter
};
