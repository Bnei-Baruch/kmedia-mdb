import { createFilterDefinition } from './util';
import { selectors } from '../../redux/slices/publicationsSlice';
import { useSelector } from 'react-redux';
import { FN_PUBLISHERS } from '../../../src/helpers/consts';

const Label = ({ value }) => {
  const publisher = useSelector(state => selectors.getPublisherById(state.publications)[value]);

  if (!publisher) return value || '';

  return publisher.name;
};

const publishersFilter = {
  name: FN_PUBLISHERS,
  queryKey: 'publisher',
  apiKey: 'publisher',
  valueToTagLabel: Label
};

export default createFilterDefinition(publishersFilter);
