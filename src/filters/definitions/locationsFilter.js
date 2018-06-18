import { createFilterDefinition } from './util';

const locationsFilter = {
  name: 'locations-filter',
  queryKey: 'location',
  valueToQuery: value => value.join('|'),
  queryToValue: queryValue => queryValue.split('|'),
  valueToTagLabel: value => (Array.isArray(value) ? [...value].reverse().join(', ') : '')
};

export default createFilterDefinition(locationsFilter);
