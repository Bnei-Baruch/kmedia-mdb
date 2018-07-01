import { createFilterDefinition } from './util';

const locationsFilter = {
  name: 'locations-filter',
  queryKey: 'location',
  valueToQuery: value => value.join('|'),
  queryToValue: queryValue => queryValue.split('|'),
  valueToTagLabel: (value, props, store, t) => {
    if (!value || !Array.isArray(value)) {
      return '';
    }

    return [...value].reverse()
      .map(x => t(`locations.${x.trim().toLowerCase().replace(/[\s_.]+/g, '-')}`, { defaultValue: x }))
      .join(', ');
  }
};

export default createFilterDefinition(locationsFilter);
