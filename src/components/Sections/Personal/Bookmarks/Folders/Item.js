import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { clsx } from 'clsx';

import { actions } from '../../../../../redux/modules/my';
import { MY_NAMESPACE_FOLDERS } from '../../../../../helpers/consts';
import { getMyItemKey } from '../../../../../helpers/my';
import { stopBubbling } from '../../../../../helpers/utils';
import { settingsGetUIDirSelector } from '../../../../../redux/selectors';

const FolderItem = ({ folder, selectedId, selectFolder }) => {
  const { t } = useTranslation();
  const [edit, setEdit]       = useState();
  const [name, setName]       = useState();
  const [confirm, setConfirm] = useState();

  const uiDir = useSelector(settingsGetUIDirSelector);

  const { id }  = folder;
  const { key } = getMyItemKey(MY_NAMESPACE_FOLDERS, folder);

  const isAll    = id === 'all';
  const isSelect = isAll ? !selectedId : id === selectedId;

  const dispatch = useDispatch();

  const handleSelectFolder = () => selectFolder(isAll ? null : id);

  const handleEditFolder = () => {
    setEdit(true);
    setName(folder.name);
  };

  const handleChangeName = e => {
    stopBubbling(e);
    setName(e.target.value);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleUpdateFolder();
    }
  };

  const handleUpdateFolder = e => {
    if (e) stopBubbling(e);
    dispatch(actions.edit(MY_NAMESPACE_FOLDERS, { id, name }));
    setEdit(false);
  };

  const toggleConfirm = () => setConfirm(!confirm);

  const handleConfirmSuccess = () => dispatch(actions.remove(MY_NAMESPACE_FOLDERS, { id, key }));

  return (
    <div className={clsx('flex flex_nowrap items-center', { 'active': isSelect })} key={id}>
      <div
        className={clsx(
          'flex-1',
          isAll ? 'w-full' : 'w-[68.75%] md:w-[56.25%] lg:w-[62.5%]',
          { 'nowrap': edit }
        )}
        onClick={handleSelectFolder}
      >
        {!edit && <span className="material-symbols-outlined text-base align-middle">folder_open</span>}
        {
          !edit ? folder.name : (
            <input
              className="w-full rounded border border-gray-300 px-2 py-1"
              onChange={handleChangeName}
              onClick={stopBubbling}
              onKeyDown={handleKeyDown}
              onFocus={e => e.target.select()}
              defaultValue={folder.name}
            />
          )
        }
      </div>
      {
        isAll ? null : (
          <div className={clsx('text-right', { 'folder_actions': !edit })}>
            {
              edit ?
                (
                  <button
                    className="no-shadow inline-flex items-center rounded border border-gray-300 px-2 py-1"
                    onClick={handleUpdateFolder}
                  >
                    <span className="material-symbols-outlined text-base">check</span>
                  </button>
                ) :
                (
                  <button
                    className="no-shadow inline-flex items-center rounded border border-gray-300 px-2 py-1"
                    onClick={handleEditFolder}
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                )
            }
            <button
              className="no-shadow inline-flex items-center rounded border border-gray-300 px-2 py-1"
              onClick={toggleConfirm}
            >
              <span className="material-symbols-outlined text-base">delete</span>
            </button>

            <Dialog open={!!confirm} onClose={toggleConfirm} className="relative z-50">
              <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6" dir={uiDir}>
                  <p>{t('personal.bookmark.confirmRemoveFolder', { name: folder.name })}</p>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      className="rounded border border-gray-300 px-4 py-2 small"
                      onClick={toggleConfirm}
                    >
                      {t('buttons.cancel')}
                    </button>
                    <button
                      className="rounded bg-blue-500 px-4 py-2 small text-white"
                      onClick={handleConfirmSuccess}
                    >
                      {t('buttons.apply')}
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </div>
        )
      }
    </div>
  );
};

export default FolderItem;
