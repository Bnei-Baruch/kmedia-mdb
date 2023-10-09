import { FN_FREE_TEXT } from '../../../src/helpers/consts';
import { createFilterDefinition } from './util';

const cuNameFilter = {
  name: FN_FREE_TEXT,
  queryKey: 'name',
  apiKey: 'name',
  valueToApiParam: value => ({ q: value })
};

export default createFilterDefinition(cuNameFilter);
