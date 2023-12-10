import { createSlice } from '@reduxjs/toolkit';
import isFunction from 'lodash/isFunction';

import { isEmpty } from '../../helpers/utils';

const setFilterState = (state, namespace, name, newFilterStateReducer) => {
  const oldNamespace = state[namespace] || { [name]: {} };
  if (!oldNamespace[name]) {
    oldNamespace[name] = {};
  }

  const newFilterState = isFunction(newFilterStateReducer)
    ? newFilterStateReducer(oldNamespace[name])
    : newFilterStateReducer;

  state[namespace] ||= {};

  if (oldNamespace[name] !== newFilterState) {
    state[namespace][name] = { ...oldNamespace[name], ...newFilterState };
  }
};

const filtersSlice = createSlice({
  name        : 'filters',
  initialState: {},

  reducers: {
    setFilterValue     : {
      prepare: (namespace, name, value, index) => ({ payload: { namespace, name, value, index } }),
      reducer: (state, { payload: { namespace, name, value } }) => {
        setFilterState(state, namespace, name, () => {
          const arrayObjectOrString = Array.isArray(value)
            || typeof value === 'object'
            || typeof value === 'string';
          return {
            values: arrayObjectOrString && isEmpty(value) ? [] : [value]
          };
        });
      }
    },
    setFilterValueMulti: {
      prepare: (namespace, name, value) => ({ payload: { namespace, name, value } }),
      reducer: (state, { payload: { namespace, name, value } }) => {
        let fReducer = () => ({ values: value });
        if (!Array.isArray(value)) {
          fReducer = () => {
            const arrayObjectOrString = Array.isArray(value)
              || typeof value === 'object'
              || typeof value === 'string';
            return {
              values: arrayObjectOrString && isEmpty(value) ? [] : [value]
            };
          };
        }

        setFilterState(state, namespace, name, fReducer);
      }
    },
    resetFilter        : {
      prepare: (namespace, name) => ({ payload: { namespace, name } }),
      reducer: (state, { payload: { namespace, name } }) => {
        setFilterState(state, namespace, name, () => ({ values: [] }));
      }
    },
    resetNamespace     : {
      prepare: namespace => ({ payload: { namespace } }),
      reducer: (state, { payload: { namespace } }) => {
        state[namespace] = {};
      }
    },

    setHydratedFilterValues: {
      prepare: (namespace, filters) => ({ payload: { namespace, filters } }),
      reducer: (state, action) => {
        const { payload: { namespace, filters } } = action;
        const oldNamespace          = state[namespace] || {};
        state.isHydrated ||= {};
        state.isHydrated[namespace] = true;

        state[namespace] = {
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
      }
    },
    hydrateFilters         : {
      prepare: namespace => ({ payload: { namespace } }),
      reducer: (state, { payload: { namespace } }) => {
        state.isHydrated ||= {};
        state.isHydrated[namespace] = false;
      }
    },
    filtersHydrated        : {
      prepare: namespace => ({ payload: { namespace } }),
      reducer: (state, { payload: { namespace } }) => {
        state.isHydrated ||= {};
        state.isHydrated[namespace] = false;
      }
    }
  }
});

export default filtersSlice.reducer;

export const { actions } = filtersSlice;

export const types = Object.fromEntries(new Map(
  Object.values(filtersSlice.actions).map(a => [a.type, a.type])
));

/* Selectors */

const getNSFilters = (state, namespace) => state[namespace] || {};

const getFilterByName = (state, namespace, name) => state[namespace]?.[name];

const getFilters = (state, namespace) => {
  const filters = state[namespace] ? state[namespace] : null;

  if (!filters) {
    return [];
  }

  return Object.keys(filters).map(name => ({
    name,
    ...filters[name]
  }));
};

const getNotEmptyFilters = (state, namespace) => getFilters(state, namespace).filter(x => !isEmpty(x?.values));

const getIsHydrated = (state, namespace) => !!state.isHydrated && !!state.isHydrated[namespace];

export const selectors = {
  getNSFilters,
  getFilters,
  getNotEmptyFilters,
  getIsHydrated,
  getFilterByName
};
