import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Modal } from 'semantic-ui-react';

import { actions } from '../../../../../redux/modules/my';
import { MY_NAMESPACE_BOOKMARKS } from '../../../../../helpers/consts';
import BookmarkForm from '../../../../shared/SaveBookmark/BookmarkForm';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';

const Actions = ({ id, t }) => {
  const [open, setOpen]         = useState();
  const [openEdit, setOpenEdit] = useState();
  const dispatch                = useDispatch();

  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = getLanguageDirection(language);

  const removeItem = e => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(actions.remove(MY_NAMESPACE_BOOKMARKS, { id }));
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
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setOpenEdit(false);
    handleClose();
  };

  return (
    <Dropdown
      className="cu_item_dropdown"
      icon={'ellipsis vertical'}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      <Dropdown.Menu
        direction="left">
        <Modal
          trigger={
            <Dropdown.Item
              content={t('personal.editBookmark')}
              onClick={handleOpenEdit}
              icon="pencil"
            />
          }
          open={openEdit}
          onClose={handleCloseEdit}
          size="tiny"
          dir={dir}
        >
          <Modal.Header content={t('personal.saveBookmark')} />
          <BookmarkForm onClose={handleCloseEdit} bookmarkId={id} />
        </Modal>
        <Dropdown.Item
          fitted="vertically"
          icon="remove circle"
          onClick={removeItem}
          content={t('personal.removeBookmark')}
        />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default withNamespaces()(Actions);
