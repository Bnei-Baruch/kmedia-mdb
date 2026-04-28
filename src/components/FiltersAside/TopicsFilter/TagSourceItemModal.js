import { clsx } from 'clsx';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';

import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import TagSourceItem from './TagSourceItem';
import { settingsGetUIDirSelector } from '../../../redux/selectors';

const ITEMS_PER_ROW = 3;
const buildRowArr = n => {
  const abs = n % ITEMS_PER_ROW;
  const len = ((n - abs) / ITEMS_PER_ROW) + ((abs === 0) ? 0 : 1);
  return Array(len).fill(0);
};

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

  const renderRow = (x, i) => (
    <tr key={i} className="align-top">
      {children.slice(i * ITEMS_PER_ROW, (i + 1) * ITEMS_PER_ROW).map(renderItem)}
    </tr>
  );

  const renderItem = (item, i) => {
    if (!item) return <td key={i} />;

    return (
      <td
        className={clsx('tree_item_modal_content', { 'item single_item': !(item.children.length > 0) })}
        key={i}
      >
        <TagSourceItem {...props} id={item.id} deep={-1} />
      </td>
    );
  };

  const rows = buildRowArr(children.length);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={clsx('filters_aside_tree_modal relative z-50', { [uiDir]: true })}
      dir={uiDir}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl">
          <div className="no-border p-4 border-b">
            <div>{parent[field]}</div>
            <input
              className="search-input w-full border border-gray-300 rounded px-3 py-2 mt-2"
              placeholder={t('sources-library.filter')}
              onChange={handleSetQuery}
              defaultValue={query}
            />
          </div>
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            <table className="w-full border-collapse">
              <tbody>
                {rows.map(renderRow)}
              </tbody>
            </table>
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
