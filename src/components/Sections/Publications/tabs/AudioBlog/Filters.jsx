import { useTranslation } from 'react-i18next';

import FiltersHydrator from '../../../../Filters/FiltersHydrator';
import DateFilter from '../../../../FiltersAside/DateFilter';
import Language from './LanguageFilter';

const Filters = ({ namespace }) => {
  const { t } = useTranslation();
  return (
    <div className="px-4">
      <FiltersHydrator namespace={namespace} />
      <h3 className="text-lg font-bold uppercase tracking-wide mt-4">
        {t('filters.aside-filter.filters-title')}
      </h3>
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </div>
  );
};

export default Filters;
