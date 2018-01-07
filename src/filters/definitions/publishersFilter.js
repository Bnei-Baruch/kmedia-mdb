import { createFilterDefinition } from './util';
import { selectors } from '../../redux/modules/publications';

const publishersFilter = {
  name: 'publishers-filter',
  queryKey: 'publisher',
  valueToQuery: value => value.join('_'),
  queryToValue: queryValue => queryValue.split('_'),
  valueToApiParam: value => ({ publisher: value[value.length - 1] }),
  tagIcon: 'announcement',
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const publisherById = selectors.getPublisherById(getState().publications);
    const publisher     = publisherById[value];
    return publisher ? publisher.name : '';
  }
};

export default createFilterDefinition(publishersFilter);
