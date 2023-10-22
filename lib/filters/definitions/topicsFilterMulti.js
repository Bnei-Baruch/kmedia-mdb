import { FN_TOPICS_MULTI } from '../../../src/helpers/consts';
import { selectors } from '../../redux/slices/tagsSlice';
import { createFilterDefinition } from './util';
import { useSelector } from 'react-redux';

const Label = ({ value }) => {
  const tag = useSelector(state => selectors.getTagById(state.tags)(value));

  return tag?.label || '';
};

const topicsFilterMulti = {
  name: FN_TOPICS_MULTI,
  queryKey: 'topics',
  apiKey: 'tag',
  valueToTagLabel: Label
};

export default createFilterDefinition(topicsFilterMulti);
