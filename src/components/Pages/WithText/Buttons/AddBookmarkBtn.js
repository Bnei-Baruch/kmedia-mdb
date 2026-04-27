import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@headlessui/react';
import { useSelector } from 'react-redux';

import BookmarkForm from '../../../shared/SaveBookmark/BookmarkForm';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { selectors as settings } from '../../../../redux/modules/settings';
import SelectTopicsModal from '../../../shared/SelectTopicsModal/SelectTopicsModal';
import { textPageGetUrlInfoSelector } from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const AddBookmarkBtn = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { t }              = useTranslation();
  const dir                = useSelector(state => settings.getUIDir(state.settings));
  const { select, search } = useSelector(textPageGetUrlInfoSelector);

  const properties = { ...select, ...search };

  const [open, setOpen]         = useState(false);
  const [confirm, setConfirm]   = useState(false);
  const [openTag, setOpenTag]   = useState(false);
  const [urlProps, setUrlProps] = useState(properties);

  const handleOpen = () => {
    setUrlProps(properties);
    setOpen(true);
  };

  const handleClose = (e, el, isCreated) => {
    if (!isCreated) {
      setOpen(false);
      return;
    }

    setConfirm(true);
    setOpen(false);
  };

  const handleConfirmCancel = () => setConfirm(false);

  const handleCloseTag = () => setOpenTag(false);

  return (
    <>
      <Dialog open={confirm} onClose={handleConfirmCancel} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bookmark_confirm mx-auto max-w-sm rounded bg-white p-6" dir={dir}>
            <Dialog.Title className="large font-semibold">
              {t('personal.bookmark.bookmarkCreated')}
            </Dialog.Title>
            <div className="mt-2">{t('personal.label.contentCreate')}</div>
            <div className="mt-4 flex justify-end gap-2">
              <SelectTopicsModal
                open={openTag}
                onClose={handleCloseTag}
                trigger={
                  <button
                    className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    onClick={() => setOpenTag(true)}
                  >
                    {t('personal.label.tagging')}
                  </button>
                }
              />
              <button
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => setConfirm(false)}
              >
                {t('personal.label.ending')}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <ToolbarBtnTooltip
        textKey="add-bookmark"
        className="text_mark_on_select_btn"
        icon={<span className="material-symbols-outlined">bookmark</span>}
        onClick={handleOpen}
      />
      <Dialog open={open} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel
            className={`bookmark_modal mx-auto rounded bg-white p-6 ${!isMobileDevice ? 'max-w-sm' : 'w-full h-full'}`}
            dir={dir}
          >
            <Dialog.Title className="large font-semibold">
              {t('personal.bookmark.saveBookmark')}
            </Dialog.Title>
            <BookmarkForm onClose={handleClose} properties={urlProps} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default AddBookmarkBtn;
