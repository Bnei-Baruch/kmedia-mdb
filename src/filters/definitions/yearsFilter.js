import { createFilterDefinition } from './util';

const yearsFilter = {
  name: 'years-filter',
  queryKey: 'year',
  queryToValue: value => parseInt(value, 10),
  valueToApiParam: value => ({ year: value }),
  tagIcon: 'calendar',
  valueToTagLabel: value => (`${value}`)
};

export default createFilterDefinition(yearsFilter);
