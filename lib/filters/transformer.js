import reduce from 'lodash/reduce';
import keyBy from 'lodash/keyBy';
import compact from 'lodash/compact';
import castArray from 'lodash/castArray';
import { isEmpty } from '@/src/helpers/utils';
import * as definitions from './definitions';

const compactMap = (values, transform) => compact(values.map(transform));

export const filterValuesToQueryValues = (definition, values = []) => compactMap(castArray(values), arg => definition.valueToQuery(arg));
const queryValuesToFilterValues = (definition, values = []) => compactMap(castArray(values), arg => definition.queryToValue(arg));

function filterValuesToApiParams(definition, values = []) {
  const transformedValues = castArray(values).map(definition.valueToApiParam);
  return transformedValues.reduce((acc, param) => {
    Object.keys(param).forEach(key => {
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

export const definitionsByName = keyBy(definitions, 'name');

const filtersTransformer = {
  queryKeyToName: reduce(definitions, (acc, definition) => {
    return Object.assign(acc, { [definition.queryKey]: definition.name });
  }, {}),
  toQueryParams(filters /* arrayOf({ name: string, values: array }) */) {
    return filters.reduce((acc, filter) => {
      const definition  = definitionsByName[filter.name];
      const paramValues = filterValuesToQueryValues(definition, filter.values);
      return Object.assign(acc, { [definition.queryKey]: paramValues });
    }, {});
  },
  fromQueryParams(queryParams) {
    return Object.keys(queryParams).reduce((acc, key) => {
      const filterName = this.queryKeyToName[key];
      const definition = definitionsByName[filterName];
      if (!definition) {
        return acc;
      }

      const filterValues = queryValuesToFilterValues(definition, queryParams[key]);

      if (filterValues && Array.isArray(filterValues) && filterValues.length) {
        return Object.assign(acc, { [filterName]: filterValues });
      }

      return acc;
    }, {});
  },
  toApiParams(filters /* arrayOf({ name: string, values: array}) */) {
    return Object.keys(filters).reduce((acc, name) => {
      const definition = definitionsByName[name];
      const apiParams  = filterValuesToApiParams(definition, filters[name]);

      if (!isEmpty(apiParams)) {
        return Object.assign(acc, apiParams);
      }

      return acc;
    }, {});
  },
  /* valueToTagLabel(filterName, value, props, store, t) {
     const definition = definitionsByName[filterName];
     if (!definition) {
       return value;
     }

     return definition.valueToTagLabel(value, props, store, t);
   },*/
};

export default filtersTransformer;
