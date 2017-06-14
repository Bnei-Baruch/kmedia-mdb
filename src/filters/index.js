import reduce from 'lodash/reduce';
import qs from 'qs';
import { isEmpty } from '../helpers/utils';
import definitions from './definitions';

function filterValuesToQueryValues(definition, values = []) {
  return values.reduce((acc, value) => {
    const paramValue = definition.valueToQuery(value);
    if (paramValue) {
      acc.push(paramValue);
    }

    return acc;
  }, []);
}

function queryValuesToFilterValues(definition, values = []) {
  return values.reduce((acc, value) => {
    const filterValue = definition.queryToValue(value);
    if (filterValue) {
      acc.push(filterValue);
    }

    return acc;
  }, []);
}

function filterValuesToApiParams(definition, values = []) {
  const transformedValues = Array.isArray(values)
  ? values.map(definition.valueToApiParam)
  : definition.valueToApiParam(values);

  if (Array.isArray(transformedValues)) {
    return transformedValues.reduce((acc, param) => {
      Object.keys(param).forEach((key) => {
        const value = param[key];
        if (Array.isArray(acc[key])) {
          acc[key].push(value);
        } else {
          acc[key] = [value];
        }
      });
      return acc;
    }, {});
  }

  return transformedValues;
}

const filters = {
  definitionsByName: reduce(definitions, (acc, definition) => Object.assign(acc, { [definition.name]: definition }), {}),
  queryKeyToName: reduce(definitions, (acc, definition) => Object.assign(acc, { [definition.queryKey]: definition.name }), {}),
  toQuery(_filters /* arrayOf({ [name: string]: values: array}) */) {
    const queryParams = _filters.reduce((acc, filter) => {
      const definition = this.definitionsByName[filter.name];
      const paramValues = filterValuesToQueryValues(definition, filter.values);

      if (paramValues && Array.isArray(paramValues) && paramValues.length) {
        return Object.assign(acc, { [filter.name]: paramValues });
      }

      return acc;
    }, {});

    return `?${qs.stringify(queryParams, { arrayFormat: 'repeat' })}`;
  },
  fromQuery(query) {
    const queryParams = qs.parse(query);
    return Object.keys(queryParams).reduce((acc, key) => {
      const filterName = this.queryKeyToName[key];
      const definition = this.definitionsByName[filterName];
      const filterValues = queryValuesToFilterValues(definition, queryParams[key]);

      if (filterValues && Array.isArray(filterValues) && filterValues.length) {
        return Object.assign(acc, { [filterName]: filterValues });
      }

      return acc;
    }, {});
  },
  toApiParams(_filters /* arrayOf({ [name: string]: values: array}) */) {
    console.log(_filters);
    return _filters.reduce((acc, filter) => {
      const definition = this.definitionsByName[filter.name];
      console.log(filter);
      const apiParams = filterValuesToApiParams(definition, filter.values);

      if (!isEmpty(apiParams)) {
        return Object.assign(acc, apiParams);
      }

      return acc;
    }, {});
  }
};

console.log(filters);

export default filters;
