import { createFilterDefinition } from './util';
import { FN_PUBLISHER } from '../../helpers/consts';
import { publicationsGetPublisherByIdSelector } from '../../redux/selectors';

const publishersFilter = {
  name: FN_PUBLISHER,
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
