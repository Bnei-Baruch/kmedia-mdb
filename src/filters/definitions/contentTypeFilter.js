import { createFilterDefinition } from './util';
import { FN_CONTENT_TYPE } from '../../helpers/consts';

const contentTypeFilter = {
  name: FN_CONTENT_TYPE,
  queryKey: 'content_type',
  valueToQuery: value => value,
  queryToValue: queryValue => queryValue,
  valueToApiParam: value => ({ content_type: value }),
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    return value;
  }
};

export default createFilterDefinition(contentTypeFilter);
