import { createAction } from 'redux-actions';
import isFunction from 'lodash/isFunction';

import { handleActions } from './settings';
import { isEmpty } from '../../helpers/utils';

/* Types */

const SET_FILTER_VALUE           = 'Filters/SET_FILTER_VALUE';
const RESET_FILTER               = 'Filters/RESET_FILTER';
const RESET_NAMESPACE            = 'Filters/RESET_NAMESPACE';
const SET_HYDRATED_FILTER_VALUES = 'Filters/SET_HYDRATED_FILTER_VALUES';
const HYDRATE_FILTERS            = 'Filters/HYDRATE_FILTERS';
const FILTERS_HYDRATED           = 'Filters/FILTERS_HYDRATED';

export const types = {
  SET_FILTER_VALUE,
  RESET_FILTER,
  RESET_NAMESPACE,
  SET_HYDRATED_FILTER_VALUES,
  HYDRATE_FILTERS,
  FILTERS_HYDRATED
};

/* Actions */

const setFilterValue          = createAction(SET_FILTER_VALUE,
  (namespace, name, value, index) => ({ namespace, name, value, index }));
const resetFilter             = createAction(RESET_FILTER,
  (namespace, name) => ({ namespace, name }));
const resetNamespace          = createAction(RESET_NAMESPACE, namespace => ({ namespace }));
const setHydratedFilterValues = createAction(SET_HYDRATED_FILTER_VALUES,
  (namespace, filters) => ({ namespace, filters }));
const hydrateFilters          = createAction(HYDRATE_FILTERS, namespace => ({ namespace }));
const filtersHydrated         = createAction(FILTERS_HYDRATED, namespace => ({ namespace }));

export const actions = {
  setFilterValue,
  resetFilter,
  resetNamespace,
  setHydratedFilterValues,
  hydrateFilters,
  filtersHydrated
};

/* Reducer */

const initialState = {};

const setFilterState = (draft, namespace, name, newFilterStateReducer) => {
  const oldNamespace = draft[namespace] || { [name]: {} };
  if (!oldNamespace[name]) {
    oldNamespace[name] = {};
  }
  const newFilterState = isFunction(newFilterStateReducer)
    ? newFilterStateReducer(oldNamespace[name])
    : newFilterStateReducer;

  if (draft[namespace] === undefined) {
    draft[namespace] = {};
  }
  if (oldNamespace[name] !== newFilterState) {
    draft[namespace][name] = { ...oldNamespace[name], ...newFilterState };
  }
};

const $$setFilterValue = (draft, { namespace, name, value }) => {
  setFilterState(draft, namespace, name, () => {
    const arrayObjectOrString = Array.isArray(value)
      || typeof value === 'object'
      || typeof value === 'string';
    return {
      values: arrayObjectOrString && isEmpty(value) ? [] : [value],
    };
  });
};

const $$resetFilter = (draft, { namespace, name }) => {
  setFilterState(draft, namespace, name, () => ({ values: [] }));
};

const $$resetNamespace = (draft, { namespace }) => {
  // remove the namespace from state if it exists there
  if (draft[namespace]) {
    draft[namespace] = {};
  }
};

const $$setHydratedFilterValues = (draft, { namespace, filters }) => {
  const oldNamespace = draft[namespace] || {};
  if (draft.isHydrated === undefined) {
    draft.isHydrated = {};
  }

  draft[namespace]            = {
    // ...oldNamespace,  If we're hydrating then we need a fresh state
    ...Object.keys(filters).reduce((acc, name) => {
      const value = filters[name];
      acc[name]   = {
        ...oldNamespace[name],
        values: Array.isArray(value) ? value : [value]
      };
      return acc;
    }, {})
  };
  draft.isHydrated[namespace] = true;
};

const $$hydrateFilters = (draft, { namespace }) => {
  if (draft.isHydrated === undefined) {
    draft.isHydrated = {};
  }
  if (draft.isHydrated[namespace] === undefined) {
    draft.isHydrated[namespace] = {};
  }

  draft.isHydrated[namespace] = false;
};

const $$filtersHydrated = (draft, { namespace }) => {
  draft.isHydrated[namespace] = false;
};

export const reducer = handleActions({
  [SET_FILTER_VALUE]: $$setFilterValue,
  [RESET_FILTER]: $$resetFilter,
  [RESET_NAMESPACE]: $$resetNamespace,

  [SET_HYDRATED_FILTER_VALUES]: $$setHydratedFilterValues,
  [HYDRATE_FILTERS]: $$hydrateFilters,
  [FILTERS_HYDRATED]: $$filtersHydrated
}, initialState);

/* Selectors */

const getNSFilters = (state, namespace) => state[namespace] || {};

const getFilters = (state, namespace) => {
  const filters = state[namespace] ? state[namespace] : null;

  if (!filters) {
    return [];
  }

  return Object.keys(filters).map(name => ({
    name,
    ...filters[name],
  }));
};

const getIsHydrated = (state, namespace) => !!state.isHydrated && !!state.isHydrated[namespace];

export const selectors = {
  getNSFilters,
  getFilters,
  getIsHydrated,
};
