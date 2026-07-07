import { clsx } from 'clsx';
import { useMemo, useState, useEffect } from 'react';
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
  }, [dispatch, namespace, ct]);

  const handleSetQuery = e => setQuery(e.target.value);

  const handleClose = () => {
    setQuery(null);
    onClose();
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      className={clsx('relative', { [uiDir]: true })}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center" dir={uiDir}>
        <DialogPanel className="relative w-full max-h-[90vh] mx-4 bg-white rounded-lg flex flex-col shadow-xl">
          <div className="flex items-center justify-start gap-4 p-4 pt-8 border-b border-gray-200">
            <DialogTitle className="font-bold text-xl whitespace-nowrap">
              {t(`filters.content-types.${ct}`)}
            </DialogTitle>
            <input
              className="w-full max-w-[180px] border border-gray-300 rounded-lg px-3 py-1 text-sm"
              placeholder={t('sources-library.filter')}
              onChange={handleSetQuery}
              defaultValue={query}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-5">
              {collections.map(item => (
                <div className="tree_item_modal_content p-2" key={item.id}>
                  <CollectionItem namespace={namespace} item={item} ke/>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end p-4 border-t border-gray-200">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleClose}
            >
              {t('buttons.close')}
            </button>
          </div>
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={handleClose}
          >
            <span className="material-symbols-outlined">cancel</span>
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CollectionsByCtModal;
