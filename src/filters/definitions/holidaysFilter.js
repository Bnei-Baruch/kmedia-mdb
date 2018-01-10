import { createFilterDefinition } from './util';
import { selectors } from '../../redux/modules/events';
import { selectors as tags } from '../../redux/modules/tags';

const holidaysFilter = {
  name: 'holidays-filter',
  queryKey: 'holidays',
  valueToQuery: value => value.join('|'),
  queryToValue: queryValue => queryValue.split('|'),
  tagIcon: 'birthday',
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const v = value[0];

    // we may have tag or v (TagById is identity function on initial state)
    const tag = tags.getTagById(getState().tags)(v);
    if (tag && tag.label) {
      return tag.label;
    }

    // we may have not constructed the tree yet (loading...)
    const item = selectors.getHolidaysTree(getState().events).byIds[v];
    return item ? item.name : '';
  }
};

export default createFilterDefinition(holidaysFilter);
