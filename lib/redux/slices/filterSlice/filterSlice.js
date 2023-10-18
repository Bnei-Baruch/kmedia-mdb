import { isEmpty } from '@/src/helpers/utils';
import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const setFilterValues = (state, action) => {
  const { namespace, name, values } = action.payload;
  if (!isEmpty(values)) {
    if (!state[namespace]) state[namespace] = {};
    state[namespace][name] = values;
    return;
  }

  if (state[namespace]?.[name])
    delete state[namespace][name];

  if (isEmpty(state[namespace]))
    delete state[namespace];
};

const hydrateNamespace = (state, { payload: { namespace, filters } }) => {
  state[namespace] = filters;
}

const resetNamespace = (state, { namespace }) => {
  if (isEmpty(state[namespace]))
    delete state[namespace];
};

export const filterSlice = createSlice({
  name: 'filters',
  initialState: {},
  reducers: {
    hydrateNamespace,
    setFilterValues,
    resetNamespace,
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => ({ ...state, ...action.payload.filters }));
  }
});

/* Selectors */

const getNSFilters = (state, namespace) => state[namespace] || {};

const getFilterByName = (state, namespace, name) => state[namespace]?.[name] || [];
//TODO david need replace all with getNSFilters
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

const getNotEmptyFilters = (state, namespace) => getFilters(state, namespace).filter(x => !isEmpty(x));

export const selectors = {
  getNSFilters,
  getFilters,
  getNotEmptyFilters,
  getFilterByName,
};
