import { clsx } from 'clsx';
import React from 'react';
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
      className="relative"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className={clsx('relative bg-white rounded shadow-lg max-w-3xl w-full', { [uiDir]: true })}
          dir={uiDir}
        >
          <div className="flex items-center justify-start p-4 border-b">
            <h3 className="font-bold text-xl">{getTitle(country, t)}</h3>
          </div>
          <div className="overflow-y-auto p-4">
            <div className="grid grid-cols-3">
              {items.map(item => (
                <div className="tree_item_modal_content" key={item}>
                  <CityItem namespace={namespace} id={item} country={country}/>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end p-4 border-t">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
