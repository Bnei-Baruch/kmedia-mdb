import { FN_COUNTRIES } from '../../helpers/consts';
import { createFilterDefinition } from './util';

const countriesFilter = {
  name: FN_COUNTRIES,
  queryKey: 'countries',
  valueToApiParam: value => ({
    countries: [value]
  }),
  valueToTagLabel: (value, props, store, t) => {
    if (!value) {
      return '';
    }

    return t(value);
  }
};

export default createFilterDefinition(countriesFilter);
