import { FN_LOCATIONS } from '../../helpers/consts';
import { createFilterDefinition } from './util';

const locationsFilter = {
  name: FN_LOCATIONS,
  queryKey: 'location',
  valueToApiParam: value => ({
    location: [value]
  }),
  valueToTagLabel: (value, props, store, t) => {
    if (!value || !Array.isArray(value)) {
      return '';
    }

    return [...value].reverse()
      .map(x => t(`locations.${x.trim().toLowerCase().replace(/[\s_.]+/g, '-')}`, { defaultValue: x }))
      .join(', ');
  }
};

export default createFilterDefinition(locationsFilter);
