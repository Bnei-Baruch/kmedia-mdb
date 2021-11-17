import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Modal } from 'semantic-ui-react';

import { actions } from '../../../../../redux/modules/my';
import { MY_NAMESPACE_BOOKMARKS } from '../../../../../helpers/consts';
import BookmarkForm from '../../../../shared/SaveBookmark/BookmarkForm';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';
import { getMyItemKey } from '../../../../../helpers/my';
import { stopBubbling } from '../../../../../helpers/utils';

const Actions = ({ bookmark, t }) => {
  const [open, setOpen]         = useState();
  const [openEdit, setOpenEdit] = useState();
  const dispatch                = useDispatch();

  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = getLanguageDirection(language);

  const { key } = getMyItemKey(MY_NAMESPACE_BOOKMARKS, bookmark);

  const removeItem = e => {
    stopBubbling(e);
    dispatch(actions.remove(MY_NAMESPACE_BOOKMARKS, { id: bookmark.id, key }));
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleOpenEdit = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setOpenEdit(true);
  };

  const handleCloseEdit = e => {
    stopBubbling(e);
    setOpenEdit(false);
    handleClose();
  };

  return (
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
          dir={dir}
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
  );
};

export default withNamespaces()(Actions);
