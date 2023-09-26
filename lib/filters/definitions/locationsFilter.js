import { FN_LOCATIONS } from '../../../src/helpers/consts';
import { createFilterDefinition } from './util';
import { useTranslation } from 'next-i18next';
import { getTitle } from '../components/LocationsFilter/helper';

const Label = ({ value }) => {
  const { t } = useTranslation();

  if (!value || !Array.isArray(value)) {
    return '';
  }

  return [...value].reverse().map(x => getTitle(x, t)).join(', ');
};

const locationsFilter = {
  name: FN_LOCATIONS,
  queryKey: 'location',
  valueToApiParam: value => ({ location: [value] }),
  valueToTagLabel: Label
};

export default createFilterDefinition(locationsFilter);
