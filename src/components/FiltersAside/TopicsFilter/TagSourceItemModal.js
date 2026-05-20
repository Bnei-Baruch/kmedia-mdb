import { clsx } from 'clsx';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';

import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import TagSourceItem from './TagSourceItem';
import { settingsGetUIDirSelector } from '../../../redux/selectors';


const TagSourceItemModal = props => {
  const
    {
      baseItems,
      filterName,
      parent,
      open,
      onClose,
      getById,
      getPath,
    } = props;

  const [query, setQuery] = useState('');

  const { t } = useTranslation();

  const uiDir = useSelector(settingsGetUIDirSelector);

  if (!parent || !parent.children) return null;

  const handleSetQuery = e => setQuery(e.target.value);

  const handleClose = () => {
    setQuery(null);
    onClose();
  };

  const isTag = filterName === FN_TOPICS_MULTI;
  const field = isTag ? 'label' : 'name';

  let children = parent.children?.filter(r => baseItems.includes(r)).map(getById);
  if (query) {
    const reg = new RegExp(query, 'i');
    children = baseItems.filter(id => id !== parent.id && getPath(id).some(x => !!x && x.id === parent.id))
      .map(id => getById(id))
      .filter(x => x?.[field] && reg.test(x[field]));
  }

  if (isEmpty(children)) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={clsx('relative', { [uiDir]: true })}
      dir={uiDir}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-screen-xl">
          <div className="p-4 flex justify-start items-center gap-4">
            <h3 className='font-bold text-xl'>{parent[field]}</h3>
            <input
              className="w-full max-w-[180px] border border-gray-300 rounded-lg px-3 py-1 mt-2 text-sm"
              placeholder={t('sources-library.filter')}
              onChange={handleSetQuery}
              defaultValue={query}
            />
          </div>
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-x-6">
              {children.map(item => (
                <div
                  className={clsx('tree_item_modal_content', { 'item single_item': !(item.children.length > 0) })}
                  key={item.id}
                >
                  <TagSourceItem {...props} id={item.id} deep={-1} />
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t flex justify-end">
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TagSourceItemModal;
