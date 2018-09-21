import { createFilterDefinition } from './util';

export const languageFilter = createFilterDefinition({
  name: 'language-filter',
  queryKey: 'language',
  valueToApiParam: value => ({
    media_language: [value]
  }),
  valueToTagLabel: (value, props, store, t) => {
    if (!value) {
      return '';
    }
    return t(value);
  }
});
