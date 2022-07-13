import { FN_FREE_TEXT } from '../../helpers/consts';
import { createFilterDefinition } from './util';

const cuNameFilter = {
  name: FN_FREE_TEXT,
  queryKey: 'q',
  valueToApiParam: value => ({
    q: value
  })
};

export default createFilterDefinition(cuNameFilter);
