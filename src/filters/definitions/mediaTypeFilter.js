import { FN_MEDIA_TYPE } from '../../helpers/consts';
import { createFilterDefinition } from './util';

const mediaTypeFilter = {
  name: FN_MEDIA_TYPE,
  queryKey: 'media_type',
  valueToQuery: value => value,
  queryToValue: queryValue => queryValue,
  valueToApiParam: value => ({ media_type: value }),
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    return value;
  }
};

export default createFilterDefinition(mediaTypeFilter);
