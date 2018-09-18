import { createFilterDefinition } from './util';

export const languageFilter = createFilterDefinition({
  name: 'language-filter',
  queryKey: 'language',
  valueToApiParam: value => ({
    filter_language: [value]
  }),
  valueToTagLabel: (value, props, store, t) => {
    if (!value) {
      return '';
    }
    return t(value);
  }
});
