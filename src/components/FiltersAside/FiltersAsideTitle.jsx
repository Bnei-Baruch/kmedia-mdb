import { useTranslation } from 'react-i18next';

// Semantic `.ui.header` (h3) at the top of the filters aside
const FiltersAsideTitle = () => {
  const { t } = useTranslation();

  return (
    <h3 className="font-lato! text-[18px] leading-[1.28571429em] font-bold -mt-[2.57px] mb-[14px]">
      {t('filters.aside-filter.filters-title')}
    </h3>
  );
};

export default FiltersAsideTitle;
