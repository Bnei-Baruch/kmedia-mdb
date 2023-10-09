import { createFilterDefinition } from './util';
import { selectors as tags } from '../../redux/slices/tagsSlice/tagsSlice';
import { useSelector } from 'react-redux';
import { FN_HOLIDAYS } from '../../../src/helpers/consts';

const Label = ({ value }) => {
  const getTagById = useSelector(state => tags.getTagById(state.tags));
  if (!value) {
    return '';
  }

  const v = value[0];

  // we may have tag or v (TagById is identity function on initial state)
  const tag = getTagById(v);
  if (tag?.label) {
    return tag.label;
  }

  return v;
};

const holidaysFilter = {
  name: FN_HOLIDAYS,
  queryKey: 'holidays',
  apiKey: 'holiday',
  valueToQuery: value => value.join('|'),
  queryToValue: queryValue => queryValue.split('|'),
  valueToTagLabel: Label
};

export default createFilterDefinition(holidaysFilter);
