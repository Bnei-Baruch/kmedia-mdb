import { FN_PERSON } from '../../../src/helpers/consts';
import { createFilterDefinition } from './util';
import { useSelector } from 'react-redux';
import { selectors } from '../../redux/slices/publicationsSlice';
import { selectors as mdbSelectors } from '../../redux/slices/mdbSlice';

const Label = ({ value }) => {
  const person = useSelector(state => mdbSelectors.getPersonById(state.mdb)(value));

  if (!person) return value || '';

  return person.name;
};

const personsFilter = {
  name: FN_PERSON,
  queryKey: 'person',
  apiKey: 'person',
  valueToApiParam: value => ({ person: value }),
  valueToTagLabel: Label
};

export default createFilterDefinition(personsFilter);
