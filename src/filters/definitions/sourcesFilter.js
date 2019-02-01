import { createFilterDefinition } from './util';
import { selectors } from '../../redux/modules/sources';

const breadCrumb = (x, index, lastIndex) => {
  if (index === lastIndex) {
    return `<span class="filter__breadcrumb" title="${x.name}">${x.name}</span>`;
  }
  return `<span class="filter__breadcrumb" title="${x.name}">&hellip;</span>`;
};

const sourcesFilter = {
  name: 'sources-filter',
  queryKey: 'source',
  valueToQuery: value => value.join('_'),
  queryToValue: queryValue => queryValue.split('_'),
  valueToApiParam: value => ({ [value.length === 1 ? 'author' : 'source']: value[value.length - 1] }),
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const getSourceById = selectors.getSourceById(getState().sources);
    const path          = value.map(getSourceById);

    // Make sure we have all items.
    // Location hydration probably happens before we receive sources
    const lastIndex = path.length - 1;
    return path.some(x => !x)
      ? ''
      : path
        .map((x, index) => breadCrumb(x, index, lastIndex))
        .join('<span class="filter__separator"> / </span>');
  }
};

export default createFilterDefinition(sourcesFilter);
