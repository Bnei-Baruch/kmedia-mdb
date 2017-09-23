import { createFilterDefinition } from './util';

const yearsFilter = {
  name: 'years-filter',
  queryKey: 'year',
  valueToApiParam: value => ({ year: value }),
  tagIcon: 'calendar',
  valueToTagLabel: value => (`${value}`)
};

export default createFilterDefinition(yearsFilter);
