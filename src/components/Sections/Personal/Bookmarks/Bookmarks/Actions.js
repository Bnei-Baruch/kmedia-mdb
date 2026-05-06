import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';

import { actions } from '../../../../../redux/modules/my';
import { MY_NAMESPACE_BOOKMARKS } from '../../../../../helpers/consts';
import BookmarkForm from '../../../../shared/SaveBookmark/BookmarkForm';
import { getMyItemKey } from '../../../../../helpers/my';
import { stopBubbling } from '../../../../../helpers/utils';
import AlertModal from '../../../../shared/AlertModal';
import { settingsGetUIDirSelector } from '../../../../../redux/selectors';

const Actions = ({ bookmark }) => {
  const { t } = useTranslation();
  const [open, setOpen]         = useState();
  const [openEdit, setOpenEdit] = useState();
  const [alertMsg, setAlertMsg] = useState();
  const [confirm, setConfirm]   = useState();

  const dispatch = useDispatch();
  const menuRef  = useRef(null);

  const uiDir = useSelector(settingsGetUIDirSelector);

  const { key } = getMyItemKey(MY_NAMESPACE_BOOKMARKS, bookmark);

  const removeItem = e => {
    stopBubbling(e);
    setConfirm(true);
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleOpenEdit = e => {
    stopBubbling(e);
    setOpenEdit(true);
  };

  const handleCloseEdit = (e, el, isUpdated) => {
    if (e?.stopPropagation) stopBubbling(e);
    setOpenEdit(false);
    handleClose();
    isUpdated && setAlertMsg(t('personal.bookmark.bookmarkUpdated'));
  };

  const handleAlertClose = () => setAlertMsg(null);

  const handleConfirmCancel = () => setConfirm(false);

  const handleConfirmSuccess = () => {
    dispatch(actions.remove(MY_NAMESPACE_BOOKMARKS, { id: bookmark.id, key }));
    setConfirm(false);
  };

  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        handleClose();
      }
    };

    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={handleAlertClose}/>
      <Dialog open={!!confirm} onClose={handleConfirmCancel} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6" dir={uiDir}>
            <p>{t('personal.bookmark.confirmRemoveBookmark', { name: bookmark.name })}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded border border-gray-300 px-4 py-2 small"
                onClick={handleConfirmCancel}
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
      <div className="relative inline-block" ref={menuRef}>
        <button
          className="p-1"
          onClick={open ? handleClose : handleOpen}
        >
          <span className="material-symbols-outlined text-2xl text-gray-400 mt-1">more_vert</span>
        </button>
        {open && (
          <div className="absolute right-0 z-10 mt-1 w-48 rounded border border-gray-200 bg-white shadow-lg">
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left small hover:bg-gray-100"
              onClick={handleOpenEdit}
            >
              <span className="material-symbols-outlined text-base">edit</span>
              {t('personal.bookmark.editBookmark')}
            </button>
            <button
              className="flex w-full items-center gap-2 px-4 py-2 text-left small hover:bg-gray-100"
              onClick={removeItem}
            >
              <span className="material-symbols-outlined text-base">cancel</span>
              {t('personal.bookmark.removeBookmark')}
            </button>
          </div>
        )}
      </div>
      <Dialog open={!!openEdit} onClose={() => handleCloseEdit()} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white bookmark_modal" dir={uiDir}>
            <h3 className="border-b p-4 large font-semibold">
              {t('personal.bookmark.editBookmark')}
            </h3>
            <BookmarkForm onClose={handleCloseEdit} bookmarkId={bookmark.id}/>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default Actions;
