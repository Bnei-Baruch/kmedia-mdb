import { createFilterDefinition } from './util';
import { selectors } from '../../redux/modules/tags';

const breadCrumb = (x, index, lastIndex) => {
  if (index === lastIndex) {
    return `<span class="filter__breadcrumb" title="${x.label}">${x.label}</span>`;
  }
  return `<span class="filter__breadcrumb" title="${x.label}">&hellip;</span>`;
};

const topicsFilter = {
  name: 'topics-filter',
  queryKey: 'topic',
  valueToQuery: value => value.join('_'),
  queryToValue: queryValue => queryValue.split('_'),
  valueToApiParam: value => ({ tag: value[value.length - 1] }),
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const getTagById = selectors.getTagById(getState().tags);
    const path       = value.map(getTagById);

    // Make sure we have all items.
    // Location hydration probably happens before we receive sources
    const lastIndex = path.length - 1;
    return path.some(x => !x) ?
      '' :
      path
        .map((x, index) => breadCrumb(x, index, lastIndex))
        .join('<span class="filter__separator"> / </span>');
  }
};

export default createFilterDefinition(topicsFilter);
