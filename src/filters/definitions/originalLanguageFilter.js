import { FN_ORIGINAL_LANGUAGES } from '../../helpers/consts';
import { createFilterDefinition } from './util';

const originalLanguageFilter = {
  name: FN_ORIGINAL_LANGUAGES,
  queryKey: 'original-language',
  valueToApiParam: value => ({
    original_language: [value]
  }),
  valueToTagLabel: (value, props, store, t) => {
    if (!value) {
      return '';
    }

    return t(value);
  }
};

export default createFilterDefinition(originalLanguageFilter);
