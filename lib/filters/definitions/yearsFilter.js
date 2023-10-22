import { createFilterDefinition } from './util';
import { FN_YEARS } from '../../../src/helpers/consts';

const yearsFilter = {
  name: FN_YEARS,
  queryKey: 'year',
  apiKey: 'year',
  queryToValue: value => parseInt(value, 10),
  valueToTagLabel: value => (`${value}`)
};

export default createFilterDefinition(yearsFilter);
