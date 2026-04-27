import clsx from 'clsx';
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

import CollectionItem from '../CollectionFilter/CollectionItem';
import {
  settingsGetUIDirSelector,
  mdbNestedGetCollectionByIdSelector,
  mdbGetCollectionsByCt
} from '../../../redux/selectors';
import { useTranslation } from 'react-i18next';
import { actions } from '../../../redux/modules/filtersAside';

const ITEMS_PER_ROW = 5;
const buildRowArr   = n => {
  const abs = n % ITEMS_PER_ROW;
  const len = (n - abs) / ITEMS_PER_ROW + ((abs === 0) ? 0 : 1);
  return Array(len).fill(0);
};

const CollectionsByCtModal = ({ namespace, onClose, ct }) => {
  const [query, setQuery] = useState('');
  const { t }             = useTranslation();

  const uiDir   = useSelector(settingsGetUIDirSelector);
  const getById = useSelector(mdbNestedGetCollectionByIdSelector);
  const ids     = useSelector(state => mdbGetCollectionsByCt(state, ct));

  const collections = useMemo(() => {
    const reg = new RegExp(query, 'i');
    return ids
      .map(getById)
      .filter(x => !!x)
      .filter(x => !query || (x.name && reg.test(x.name)))
      .sort((a, b) => a.name === b.name ? 0 : a.name > b.name ? 1 : -1);
  }, [ids, getById, query]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.collectionsByCt({ namespace, content_type: ct }));
  }, [dispatch, namespace]);

  const handleSetQuery = e => setQuery(e.target.value);

  const handleClose = () => {
    setQuery(null);
    onClose();
  };

  const renderRow = (x, i) => (
    <tr key={i} className="align-top">
      {collections.slice(i * ITEMS_PER_ROW, (i + 1) * ITEMS_PER_ROW).map(renderItem)}
    </tr>
  );

  const renderItem = (item, i) => {
    if (!item) return <td key={i}/>;

    return (
      <td className="tree_item_modal_content p-2" key={item.id}>
        <CollectionItem namespace={namespace} item={item}/>
      </td>
    );
  };

  const rows = buildRowArr(collections.length);

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      className={clsx('filters_aside_tree_modal relative z-50', { [uiDir]: true })}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center" dir={uiDir}>
        <DialogPanel className="w-full max-h-[90vh] mx-4 bg-white rounded-lg flex flex-col shadow-xl">
          <div className="no-border nowrap flex items-center justify-between gap-4 p-4 border-b">
            <DialogTitle className="large font-semibold whitespace-nowrap">
              {t(`filters.content-types.${ct}`)}
            </DialogTitle>
            <input
              className="search-input border rounded px-3 py-1.5 flex-1"
              placeholder={t('sources-library.filter')}
              onChange={handleSetQuery}
              defaultValue={query}
            />
            <button onClick={handleClose} className="shrink-0">
              <span className="material-symbols-outlined">cancel</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <table className="w-full">
              <tbody>
                {rows.map(renderRow)}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end p-4 border-t">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleClose}
            >
              {t('buttons.close')}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CollectionsByCtModal;
