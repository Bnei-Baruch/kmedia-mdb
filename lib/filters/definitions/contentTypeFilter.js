import { createFilterDefinition } from './util';
import { FN_CONTENT_TYPE } from '../../../src/helpers/consts';

const contentTypeFilter = {
  name: FN_CONTENT_TYPE,
  queryKey: 'content_type',
  apiKey: 'content_type',
  valueToApiParam: value => ({ content_type: value })
};

export default createFilterDefinition(contentTypeFilter);
