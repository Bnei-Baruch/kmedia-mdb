import { createFilterDefinition } from './util';
import { selectors as tagsSelectors } from '../../redux/modules/tags';

const topicsFilter = {
  name: 'topics-filter',
  queryKey: 'topic',
  valueToApiParam: value => ({ tag: value }),
  tagIcon: 'tag',
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    // Make sure we have the item.
    // Location hydration probably happens before we receive tags
    const tag = tagsSelectors.getTagById(getState().tags)(value);
    return tag ? tag.label : '';
  }
};

export default createFilterDefinition(topicsFilter);
