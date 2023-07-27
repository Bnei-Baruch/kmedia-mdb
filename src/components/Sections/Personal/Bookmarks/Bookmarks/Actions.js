import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Confirm, Dropdown, Modal } from 'semantic-ui-react';

import { actions } from '../../../../../redux/modules/my';
import { MY_NAMESPACE_BOOKMARKS } from '../../../../../helpers/consts';
import BookmarkForm from '../../../../shared/SaveBookmark/BookmarkForm';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { getMyItemKey } from '../../../../../helpers/my';
import { stopBubbling } from '../../../../../helpers/utils';
import AlertModal from '../../../../shared/AlertModal';

const Actions = ({ bookmark, t }) => {
  const [open, setOpen]         = useState();
  const [openEdit, setOpenEdit] = useState();
  const [alertMsg, setAlertMsg] = useState();
  const [confirm, setConfirm]   = useState();

  const dispatch = useDispatch();

  const uiDir = useSelector(state => settings.getUIDir(state.settings));

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
    stopBubbling(e);
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

  return (
    <>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={handleAlertClose} />
      <Confirm
        size="tiny"
        open={confirm}
        onCancel={handleConfirmCancel}
        onConfirm={handleConfirmSuccess}
        cancelButton={t('buttons.cancel')}
        confirmButton={t('buttons.apply')}
        content={t('personal.bookmark.confirmRemoveBookmark', { name: bookmark.name })}
        dir={uiDir}
      />
      <Dropdown
        icon={{ name: 'ellipsis vertical', size: 'large', color: 'grey', className: 'margin-top-8' }}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        <Dropdown.Menu
          direction="left">
          <Modal
            trigger={
              <Dropdown.Item
                content={t('personal.bookmark.editBookmark')}
                onClick={handleOpenEdit}
                icon="pencil"
              />
            }
            open={openEdit}
            onClose={handleCloseEdit}
            size="tiny"
            dir={uiDir}
            className="bookmark_modal"
          >
            <Modal.Header content={t('personal.bookmark.editBookmark')} />
            <BookmarkForm onClose={handleCloseEdit} bookmarkId={bookmark.id} />
          </Modal>
          <Dropdown.Item
            fitted="vertically"
            icon="remove circle"
            onClick={removeItem}
            content={t('personal.bookmark.removeBookmark')}
          />
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default withTranslation()(Actions);
