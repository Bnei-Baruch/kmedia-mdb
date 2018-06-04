import { createFilterDefinition } from './util';
import { selectors } from '../../redux/modules/publications';

const publishersFilter = {
  name: 'publishers-filter',
  queryKey: 'publisher',
  valueToApiParam: value => ({ publisher: value }),
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
