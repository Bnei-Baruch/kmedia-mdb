import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';

import { FN_LOCATIONS } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import CityItem from './CityItem';
import { getTitle } from './helper';
import { filtersAsideCitiesByCountrySelector, settingsGetUIDirSelector } from '../../../redux/selectors';

const CitiesModal = ({ country, namespace, open, onClose }) => {
  const { t } = useTranslation();

  const items = useSelector(state => filtersAsideCitiesByCountrySelector(state, namespace, FN_LOCATIONS))(country);

  const uiDir = useSelector(settingsGetUIDirSelector);

  if (isEmpty(items)) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={clsx('relative', { [uiDir]: true })}
      dir={uiDir}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-screen-xl">
          <div className="p-4 flex justify-start items-center">
            <h3 className="font-bold text-xl">{getTitle(country, t)}</h3>
          </div>
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-x-6">
              {items.map(item => (
                <CityItem namespace={namespace} id={item} country={country} key={item}/>
              ))}
            </div>
          </div>
          <div className="p-4 border-t flex justify-end">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={onClose}
            >
              {t('buttons.close')}
            </button>
          </div>
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">cancel</span>
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CitiesModal;
