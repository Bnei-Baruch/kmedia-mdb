import { FN_PERSON_FILTER } from '../../helpers/consts';
import { createFilterDefinition } from './util';

const personsFilter = {
  name: FN_PERSON_FILTER,
  queryKey: 'person',
  valueToQuery: value => value,
  queryToValue: queryValue => queryValue,
  valueToApiParam: value => ({ person: value }),
  valueToTagLabel: () => ''
};

export default createFilterDefinition(personsFilter);
