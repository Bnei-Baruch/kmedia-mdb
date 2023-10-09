import { createFilterDefinition } from './util';
import { FN_LANGUAGES } from '../../../src/helpers/consts';
import { useTranslation } from 'next-i18next';

const Label = ({ value }) => {
  const { t } = useTranslation();
  if (!value) {
    return '';
  }

  return t(value);
};

export const languageFilter = createFilterDefinition({
  name: FN_LANGUAGES,
  queryKey: 'media-language',
  apiKey: 'media-language',
  valueToApiParam: value => ({ media_language: [value] }),
  valueToTagLabel: Label
});
