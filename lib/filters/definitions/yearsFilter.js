import { createFilterDefinition } from './util';
import { FN_YEARS } from '../../../src/helpers/consts';

const yearsFilter = {
  name: FN_YEARS,
  queryKey: 'year',
  queryToValue: value => parseInt(value, 10),
  valueToApiParam: value => ({ year: value }),
  valueToTagLabel: value => (`${value}`)
};

export default createFilterDefinition(yearsFilter);
