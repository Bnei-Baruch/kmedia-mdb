import { FN_PART_OF_DAY } from '../../helpers/consts';
import { createFilterDefinition } from './util';

const dayPartFilter = {
  name    : FN_PART_OF_DAY,
  queryKey: 'day_part',
  valueToApiParam: value => ({
    day_part: value
  })
};

export default createFilterDefinition(dayPartFilter);
