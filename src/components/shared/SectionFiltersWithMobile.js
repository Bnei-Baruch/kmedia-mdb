import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Dialog, DialogPanel } from '@headlessui/react';

import { DeviceInfoContext } from '../../helpers/app-contexts';
import FiltersHydrator from '../Filters/FiltersHydrator';
import { settingsGetUIDirSelector } from '../../redux/selectors';

const SectionFiltersWithMobile = ({ filters, children, namespace }) => {
  const [openFilters, setOpenFilters] = useState(false);
  const { t } = useTranslation();

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const dir = useSelector(settingsGetUIDirSelector);

  const toggleFilters = () => setOpenFilters(!openFilters);

  const render = () => (
    <div className="flex gap-4 divide-x">
      <div className="w-1/4 filters-aside-wrapper">
        {filters}
      </div>
      <div className="w-3/4">
        {children}
      </div>
    </div>
  );

  const renderMobile = () => (
    <div className="px-4">
      <FiltersHydrator namespace={namespace} />
      <div className=" px-4">
        <button
          className="border border-blue-500 text-blue-500 rounded px-3 py-2 hover:bg-blue-50 inline-flex items-center gap-1"
          onClick={toggleFilters}
        >
          <span className="material-symbols-outlined">filter_list</span>
          {t('filters.aside-filter.filters-title')}
        </button>
      </div>
      {children}
      <Dialog open={openFilters} onClose={toggleFilters} className="relative z-50" dir={dir}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className={`bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col ${dir}`}>
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

  return isMobileDevice ? renderMobile() : render();
};

export default SectionFiltersWithMobile;
