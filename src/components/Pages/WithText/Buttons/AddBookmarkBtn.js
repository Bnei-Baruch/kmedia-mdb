import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Confirm, Modal } from 'semantic-ui-react';
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
      <Confirm
        size="tiny"
        open={confirm}
        header={t('personal.bookmark.bookmarkCreated')}
        onCancel={handleConfirmCancel}
        onConfirm={() => setConfirm(false)}
        confirmButton={{ content: t('personal.label.ending') }}
        className="bookmark_confirm"
        cancelButton={
          <SelectTopicsModal
            open={openTag}
            onClose={handleCloseTag}
            trigger={
              <Button
                color="green"
                content={t('personal.label.tagging')}
                onClick={() => setOpenTag(true)}
              />
            }
          />
        }
        content={t('personal.label.contentCreate')}
        dir={dir}
      />
      <Modal
        trigger={
          <ToolbarBtnTooltip
            textKey="add-bookmark"
            trigger={
              <Button
                icon={<span className="material-symbols-outlined">bookmark</span>}
                onClick={handleOpen}
              />
            }
          />
        }
        open={open}
        onClose={handleClose}
        size={!isMobileDevice ? 'tiny' : 'fullscreen'}
        dir={dir}
        className="bookmark_modal"
      >
        <Modal.Header content={t('personal.bookmark.saveBookmark')} />
        <BookmarkForm onClose={handleClose} properties={urlProps} />
      </Modal>
    </>
  );
};

export default AddBookmarkBtn;
