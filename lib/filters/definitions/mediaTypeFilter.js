import { FN_MEDIA_TYPE } from '../../../src/helpers/consts';
import { createFilterDefinition } from './util';
import { useSelector } from 'react-redux';
import { selectors } from '../../redux/slices/publicationsSlice';
import { useTranslation } from 'next-i18next';

const Label = ({ value }) => {
  const { t } = useTranslation();

  if (!value) return value || '';

  return t(`filters.media-types.${value}`);
};

const mediaTypeFilter = {
  name: FN_MEDIA_TYPE,
  queryKey: 'media_type',
  apiKey: 'media_type',
  valueToApiParam: value => ({ media_type: value }),
  valueToTagLabel: Label
};

export default createFilterDefinition(mediaTypeFilter);
