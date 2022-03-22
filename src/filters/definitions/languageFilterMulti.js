import { createFilterDefinition } from './util';
import { FN_LANGUAGES_MULI } from '../../helpers/consts';

const languageFilterMulti = {
  name: FN_LANGUAGES_MULI,
  queryKey: 'media-language',
  valueToApiParam: value => ({
    media_language: [value]
  }),
  valueToTagLabel: (value, props, store, t) => {
    if (!value) {
      return '';
    }

    return t(value);
  }
};

export default createFilterDefinition(languageFilterMulti);
