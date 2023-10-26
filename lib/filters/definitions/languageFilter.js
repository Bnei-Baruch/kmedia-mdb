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

const languageFilter = {
  name: FN_LANGUAGES,
  queryKey: 'media-language',
  apiKey: 'media_language',
  valueToTagLabel: Label
};

export default createFilterDefinition(languageFilter);
