import { createFilterDefinition } from './util';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';

const sourcesFilter = {
  name: 'sources-filter',
  queryKey: 'source',
  valueToQuery: value => value.join('_'),
  queryToValue: queryValue => queryValue.split('_'),
  valueToApiParam: value => ({ [value.length === 1 ? 'author' : 'source']: value[value.length - 1] }),
  tagIcon: 'book',
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const getSourceById = sourcesSelectors.getSourceById(getState().sources);
    const path          = value.map(x => getSourceById(x));

    // Make sure we have all items.
    // Location hydration probably happens before we receive sources
    return path.some(x => !x) ? '' : path.map(x => x.name).join(' > ');
  }
};

export default createFilterDefinition(sourcesFilter);
