import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Dialog, DialogPanel } from '@headlessui/react';

import { DeviceInfoContext } from '../../helpers/app-contexts';
import FiltersHydrator from '../FiltersAside/FiltersHydrator';
import { settingsGetUIDirSelector } from '../../redux/selectors';

const SectionFiltersWithMobile = ({ filters, children, namespace }) => {
  const [openFilters, setOpenFilters] = useState(false);
  const { t } = useTranslation();

  const { isMobile } = useContext(DeviceInfoContext);

  const dir = useSelector(settingsGetUIDirSelector);

  const toggleFilters = () => setOpenFilters(!openFilters);

  const render = () => (
    <div className="flex">
      <div className="w-1/4 pt-[14px]! filters-aside-wrapper">
        {filters}
      </div>
      <div className="w-3/4 p-[14px]">
        {children}
      </div>
    </div>
  );

  const renderMobile = () => (
    <div>
      <FiltersHydrator namespace={namespace} />
      <div className="p-[14px]">
        <button
          className="border border-blue-500 text-blue-500 rounded px-[21px] py-[11px] leading-none hover:bg-blue-50 inline-flex items-center gap-1.5"
          onClick={toggleFilters}
        >
          <span className="material-symbols-outlined text-[14px]! leading-none!">filter_alt</span>
          {t('filters.aside-filter.filters-title')}
        </button>
      </div>
      {children}
      <Dialog open={openFilters} onClose={toggleFilters} className="relative" dir={dir}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className={`bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col ${dir}`}>
            <div className="filters-aside-wrapper p-4 overflow-y-auto flex-1">
              {filters}
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={toggleFilters}
              >
                {t('buttons.close')}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );

  return isMobile ? renderMobile() : render();
};

export default SectionFiltersWithMobile;
