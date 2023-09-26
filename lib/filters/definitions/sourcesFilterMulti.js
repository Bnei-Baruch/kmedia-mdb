import { createFilterDefinition } from './util';
import { selectors } from '../../redux/slices/sourcesSlice';
import { FN_SOURCES_MULTI } from '../../../src/helpers/consts';
import { useSelector } from 'react-redux';

const Label = ({ value }) => {
  const source = useSelector(state => selectors.getSourceById(state.sources)(value));
  return source?.name || '';
};

const sourcesFilterMulti = {
  name: FN_SOURCES_MULTI,
  queryKey: 'sources',
  valueToApiParam: value => ({ [value.length < 8 ? 'author' : 'source']: value }),
  valueToTagLabel: Label
};

export default createFilterDefinition(sourcesFilterMulti);
