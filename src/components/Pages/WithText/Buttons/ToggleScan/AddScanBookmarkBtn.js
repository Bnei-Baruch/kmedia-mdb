import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import BookmarkForm from '../../../../shared/SaveBookmark/BookmarkForm';
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
      <Modal
        trigger={
          <ScanBtnTpl
            onClick={handleOpen}
            icon="bookmark"
            textKey="add-bookmark"
          />
        }
        open={open}
        onClose={handleClose}
        size="tiny"
        dir={dir}
        className="bookmark_modal"
      >
        <Modal.Header content={t('personal.bookmark.saveBookmark')}/>
        <BookmarkForm onClose={handleClose} properties={urlProps}/>
      </Modal>
    </>
  );
};

export default AddScanBookmarkBtn;
