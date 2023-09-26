import { FN_ORIGINAL_LANGUAGES } from '../../../src/helpers/consts';
import { createFilterDefinition } from './util';
import { useTranslation } from 'next-i18next';

const Label                  = ({ value }) => {
  const { t } = useTranslation();
  if (!value) {
    return '';
  }

  return t(value);
};
const originalLanguageFilter = {
  name: FN_ORIGINAL_LANGUAGES,
  queryKey: 'original-language',
  valueToApiParam: value => ({ original_language: [value] }),
  valueToTagLabel: Label
};

export default createFilterDefinition(originalLanguageFilter);
