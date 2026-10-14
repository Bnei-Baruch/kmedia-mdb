import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@headlessui/react';
import { useSelector } from 'react-redux';

import BookmarkForm, { BOOKMARK_MODAL_PANEL, BOOKMARK_MODAL_TITLE } from '../../../../shared/SaveBookmark/BookmarkForm';
import { selectors as settings } from '../../../../../redux/modules/settings';
import ScanBtnTpl from './ScanBtnTpl';

const urlProps           = { 'scan': true };
const AddScanBookmarkBtn = () => {
  const { t } = useTranslation();
  const dir   = useSelector(state => settings.getUIDir(state.settings));

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);
  return (
    <>
      <ScanBtnTpl
        onClick={handleOpen}
        icon="bookmark"
        textKey="add-bookmark"
      />
      <Dialog open={open} onClose={handleClose} className="relative">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className={BOOKMARK_MODAL_PANEL} dir={dir}>
            <Dialog.Title className={BOOKMARK_MODAL_TITLE}>
              {t('personal.bookmark.saveBookmark')}
            </Dialog.Title>
            <BookmarkForm onClose={handleClose} properties={urlProps}/>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default AddScanBookmarkBtn;
