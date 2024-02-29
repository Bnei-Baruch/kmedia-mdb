import { createFilterDefinition } from './util';
import { publicationsGetPublisherByIdSelector } from '../../redux/selectors';

const publishersFilter = {
  name: 'publishers-filter',
  queryKey: 'publisher',
  valueToApiParam: value => ({ publisher: value }),
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const publisherById = publicationsGetPublisherByIdSelector(getState());
    const publisher     = publisherById[value];
    return publisher ? publisher.name : '';
  }
};

export default createFilterDefinition(publishersFilter);
