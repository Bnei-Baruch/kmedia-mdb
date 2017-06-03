import { createAction, handleActions } from 'redux-actions';

/* Types */

const SET_FILTER_VALUE  = 'Filters/SET_FILTER_VALUE';
const ACTIVATE_FILTER = 'Filters/ACTIVATE_FILTER';
const DEACTIVATE_FILTER = 'Filters/DECTIVATE_FILTER';
const CLEAR_FILTER = 'Filters/CLEAR_FILTER';

export const types = {
  SET_FILTER_VALUE,
  ACTIVATE_FILTER,
  DEACTIVATE_FILTER,
  CLEAR_FILTER
};

/* Actions */

const setFilterValue = createAction(SET_FILTER_VALUE, (namespace, name, value) => ({ namespace, name, value }));
const activateFilter = createAction(ACTIVATE_FILTER, (namespace, name) => ({ namespace, name }));
const deactivateFilter = createAction(DEACTIVATE_FILTER, (namespace, name) => ({ namespace, name }));
const clearFilter = createAction(CLEAR_FILTER, (namespace, name) => ({ namespace, name }))

export const actions = {
  setFilterValue,
  activateFilter,
  deactivateFilter,
  clearFilter
};

/* Reducer */

const initialState = {};

const _setFilterValue = (state, action) => {
  const { namespace, name, value } = action.payload;
  const oldFilterNamespace = state[namespace] || {};

  return {
    ...state,
    [namespace]: {
      ...oldFilterNamespace,
      [name]: {
        ...oldFilterNamespace[name],
        value,
      }
    }
  };
};

const _activateFilter = (state, action) => {
  const { namespace, name } = action.payload;
  const oldFilterNamespace = state[namespace] || {};

  return {
    ...state,
    [namespace]: {
      ...oldFilterNamespace,
      [name]: {
        ...oldFilterNamespace[name],
        active: true
      }
    }
  };
};

const _deactivateFilter = (state, action) => {
  const { namespace, name } = action.payload;
  const oldFilterNamespace = state[namespace] || {};

  return {
    ...state,
    [namespace]: {
      ...oldFilterNamespace,
      [name]: {
        ...oldFilterNamespace[name],
        active: false
      }
    }
  };
};

const _clearFilter = (state, action) => {
  const { namespace, name } = action.payload;
  const oldFilterNamespace = state[namespace] || {};

  return {
    ...state,
    [namespace]: {
      ...oldFilterNamespace,
      [name]: {
        value: undefined,
        active: false
      }
    }
  };
};

export const reducer = handleActions({
  [SET_FILTER_VALUE]: (state, action) => _setFilterValue(state, action),
  [ACTIVATE_FILTER]: (state, action) => _activateFilter(state, action),
  [DEACTIVATE_FILTER]: (state, action) => _deactivateFilter(state, action),
  [CLEAR_FILTER]: (state, action) => _clearFilter(state, action)
}, initialState);

/* Selectors */
const getFilterValue = (state, namespace, name) =>
  (state[namespace] && state[namespace][name] && state[namespace][name].value ? state[namespace][name].value : undefined);

// TODO (yaniv): use reselect to cache
const getActivatedFilters = (state, namespace) => {
  const filters = state[namespace] ? state[namespace] : null;

  if (!filters) {
    return [];
  }

  return Object.keys(filters).map(filterName => ({
    name: filterName,
    ...filters[filterName]
  })).filter(filter => filter.active);
};

export const selectors = {
  getFilterValue,
  getActivatedFilters
};
