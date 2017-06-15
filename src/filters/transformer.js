import reduce from 'lodash/reduce';
import keyBy from 'lodash/keyBy';
import compact from 'lodash/compact';
import castArray from 'lodash/castArray';
import { isEmpty } from '../helpers/utils';
import * as definitions from './definitions';

const compactMap = (values, transform) => compact(castArray(values).map(transform));

const filterValuesToQueryValues = (definition, values = []) =>
  compactMap(values, arg => definition.valueToQuery(arg));
const queryValuesToFilterValues = (definition, values = []) =>
  compactMap(values, arg => definition.queryToValue(arg));

function filterValuesToApiParams(definition, values = []) {
  const transformedValues = castArray(values).map(definition.valueToApiParam);
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
};

const filtersTransformer = {
  definitionsByName: keyBy(definitions, 'name'),
  queryKeyToName: reduce(definitions, (acc, definition) => Object.assign(acc, { [definition.queryKey]: definition.name }), {}),
  toQueryParams(filters /* arrayOf({ name: string, values: array }) */) {
    const queryParams = filters.reduce((acc, filter) => {
      const definition = this.definitionsByName[filter.name];
      const paramValues = filterValuesToQueryValues(definition, filter.values);

      if (paramValues.length) {
        return Object.assign(acc, { [definition.queryKey]: paramValues });
      }

      return acc;
    }, {});

    return queryParams;
  },
  fromQueryParams(queryParams) {
    return Object.keys(queryParams).reduce((acc, key) => {
      const filterName = this.queryKeyToName[key];
      const definition = this.definitionsByName[filterName];
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
    return filters.reduce((acc, filter) => {
      const definition = this.definitionsByName[filter.name];
      const apiParams = filterValuesToApiParams(definition, filter.values);

      if (!isEmpty(apiParams)) {
        return Object.assign(acc, apiParams);
      }

      return acc;
    }, {});
  }
};

export default filtersTransformer;
