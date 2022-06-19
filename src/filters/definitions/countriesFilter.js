import { FN_LOCATIONS } from '../../helpers/consts';
import { createFilterDefinition } from './util';

const countriesFilter = {
  name: FN_LOCATIONS,
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
