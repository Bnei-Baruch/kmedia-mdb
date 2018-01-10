import { createFilterDefinition } from './util';
import { selectors } from '../../redux/modules/events';

const locationsFilter = {
  name: 'locations-filter',
  queryKey: 'location',
  valueToQuery: value => value.join('|'),
  queryToValue: queryValue => queryValue.split('|'),
  tagIcon: 'marker',
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const tree = selectors.getLocationsTree(getState().events);
    const path = value.map(x => tree.byIds[x]);

    // Make sure we have all items.
    // Location hydration probably happens before we receive sources
    return path.some(x => !x) ? '' : path.reverse().map(x => x.name).join(', ');
  }
};

export default createFilterDefinition(locationsFilter);
