import { createFilterDefinition } from './util';
import { selectors as eventsSelectors } from '../../redux/modules/events';

const eventTypesFilter = {
  name: 'event-types-filter',
  queryKey: 'eventType',
  valueToQuery: value => value.join('|'),
  queryToValue: queryValue => queryValue.split('|'),
  valueToApiParam: (value) => {
    const result = {
      content_type: value[0]
    };

    if (value.length > 1) {
      result.value = value[value.length - 1];
    }

    return result;
  },
  tagIcon: 'book',
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const tree = eventsSelectors.getEventFilterTree(getState().events);
    const path          = value.map(x => tree.byIds[x]);

    // Make sure we have all items.
    // Location hydration probably happens before we receive sources
    return path.some(x => !x) ? '' : path.map(x => x.name).join(' > ');
  }
};

export default createFilterDefinition(eventTypesFilter);
