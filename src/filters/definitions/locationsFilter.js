import { createFilterDefinition } from './util';

const locationsFilter = {
  name: 'locations-filter',
  queryKey: 'location',
  valueToQuery: value => value.join('|'),
  queryToValue: queryValue => queryValue.split('|'),
  tagIcon: 'marker',
  valueToTagLabel: value => (Array.isArray(value) ? [...value].reverse().join(', ') : '')
};

export default createFilterDefinition(locationsFilter);
