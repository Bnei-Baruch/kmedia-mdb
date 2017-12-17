import { createFilterDefinition } from './util';
import { selectors as selectors } from '../../redux/modules/tags';

const topicsFilter = {
  name: 'topics-filter',
  queryKey: 'topic',
  valueToQuery: value => value.join('_'),
  queryToValue: queryValue => queryValue.split('_'),
  valueToApiParam: value => ({ tag: value[value.length - 1] }),
  tagIcon: 'tag',
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const getTagById = selectors.getTagById(getState().tags);
    const path          = value.map(getTagById);

    // Make sure we have all items.
    // Location hydration probably happens before we receive sources
    return path.some(x => !x) ? '' : path.map(x => x.label).join(' > ');
  }
};

export default createFilterDefinition(topicsFilter);
