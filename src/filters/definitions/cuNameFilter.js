import { FN_CU_NAME } from '../../helpers/consts';
import { createFilterDefinition } from './util';

const cuNameFilter = {
  name: FN_CU_NAME,
  queryKey: 'q',
  valueToApiParam: value => ({
    q: value
  })
};

export default createFilterDefinition(cuNameFilter);
