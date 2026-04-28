import { clsx } from 'clsx';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';

import { FN_LOCATIONS } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import CityItem from './CityItem';
import { getTitle } from './helper';
import { filtersAsideCitiesByCountrySelector, settingsGetUIDirSelector } from '../../../redux/selectors';

const ITEMS_PER_ROW = 3;
const buildRowArr   = n => {
  const abs = n % ITEMS_PER_ROW;
  const len = ((n - abs) / ITEMS_PER_ROW) + ((abs === 0) ? 0 : 1);
  return Array(len).fill(0);
};

const CitiesModal = ({ country, namespace, open, onClose, t }) => {

  const items = useSelector(state => filtersAsideCitiesByCountrySelector(state, namespace, FN_LOCATIONS))(country);

  const uiDir = useSelector(settingsGetUIDirSelector);

  if (isEmpty(items)) return null;

  const renderRow = (x, i) => (
    <tr key={i} className="align-top">
      {items.slice(i * ITEMS_PER_ROW, (i + 1) * ITEMS_PER_ROW).map(renderItem)}
    </tr>
  );

  const renderItem = (item, i) => {
    if (!item) return <td key={i}/>;

    return (
      <td className="tree_item_modal_content" key={i}>
        <CityItem namespace={namespace} id={item} country={country}/>
      </td>
    );
  };

  const rows = buildRowArr(items.length);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className={clsx('filters_aside_tree_modal bg-white rounded shadow-lg max-w-3xl w-full', { [uiDir]: true })}
          dir={uiDir}
        >
          <div className="no-border nowrap flex items-center justify-between p-4 border-b">
            <span className="font-bold large">{getTitle(country, t)}</span>
            <button onClick={onClose} className="p-1">
              <span className="material-symbols-outlined">cancel</span>
            </button>
          </div>
          <div className="overflow-y-auto p-4">
            <table className="w-auto">
              <tbody>
                {
                  rows.map(renderRow)
                }
              </tbody>
            </table>
          </div>
          <div className="flex justify-end p-4 border-t">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={onClose}
            >
              {t('buttons.close')}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default withTranslation()(CitiesModal);
