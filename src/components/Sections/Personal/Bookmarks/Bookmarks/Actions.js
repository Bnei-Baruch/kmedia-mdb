import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import { actions } from '../../../../../redux/modules/my';
import { MY_NAMESPACE_BOOKMARKS } from '../../../../../helpers/consts';
import BookmarkButton from '../../../../shared/SaveBookmark/BookmarkButton';

const Actions = ({ id, t }) => {
  const [open, setOpen] = useState();
  const dispatch        = useDispatch();

  const removeItem = e => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(actions.remove(MY_NAMESPACE_BOOKMARKS, { id }));
  };

  const handleOpen = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setOpen(true);
  };

  const handleClose = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setOpen(false);
  };

  return (
    <Dropdown
      className="cu_item_dropdown"
      icon={'ellipsis vertical'}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      <Dropdown.Menu direction="left">
        <Dropdown.Item fitted="horizontally">
          <BookmarkButton bookmarkId={id} />
        </Dropdown.Item>
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
