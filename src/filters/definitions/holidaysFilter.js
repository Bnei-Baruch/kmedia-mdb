import { createFilterDefinition } from './util';
import { selectors as tags } from '../../../lib/redux/slices/tagsSlice/tagsSlice';

const holidaysFilter = {
  name: 'holidays-filter',
  queryKey: 'holidays',
  valueToQuery: value => value.join('|'),
  queryToValue: queryValue => queryValue.split('|'),
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const v = value[0];

    // we may have tag or v (TagById is identity function on initial state)
    const tag = tags.getTagById(getState().tags)(v);
    if (tag?.label) {
      return tag.label;
    }

    return v;
  }
};

export default createFilterDefinition(holidaysFilter);
