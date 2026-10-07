import { useTranslation } from 'react-i18next';

import FiltersHydrator from '../../../../FiltersAside/FiltersHydrator';
import DateFilter from '../../../../FiltersAside/DateFilter';
import Language from './LanguageFilter';

const Filters = ({ namespace }) => {
  const { t } = useTranslation();
  return (
    <div className="px-4">
      <FiltersHydrator namespace={namespace} />
      <h3 className="font-lato! text-[18px] leading-[1.28571429em] font-bold -mt-[2.57px] mb-[14px]">
        {t('filters.aside-filter.filters-title')}
      </h3>
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </div>
  );
};

export default Filters;
