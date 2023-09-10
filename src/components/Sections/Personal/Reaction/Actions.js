import React, { useState } from 'react';
import { withTranslation } from 'next-i18next';
import { useDispatch } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import { actions } from '../../../../redux/modules/my';
import { MY_NAMESPACE_REACTIONS } from '../../../../helpers/consts';
import PlaylistInfo from '../../../Pages/WithPlayer/widgets/Info/SavePlaylistItemBtn';
import { getMyItemKey } from '../../../../helpers/my';
import { stopBubbling } from '../../../../helpers/utils';

const Actions = ({ cuId, reaction, t }) => {
  const [open, setOpen] = useState();
  const dispatch        = useDispatch();
  const { key }         = getMyItemKey(MY_NAMESPACE_REACTIONS, reaction);

  const removeItem = e => {
    stopBubbling(e);
    dispatch(actions.remove(MY_NAMESPACE_REACTIONS, { ...reaction, key }));
  };

  const handleOpen = e => {
    stopBubbling(e);
    setOpen(true);
  };

  const handleClose = e => {
    stopBubbling(e);
    setOpen(false);
  };

  return (
    <Dropdown
      icon={'ellipsis vertical'}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      closeOnChange
      inline
      className="cu_item_dropdown"
    >
      <Dropdown.Menu direction="left">
        <Dropdown.Item fitted="horizontally">
          <PlaylistInfo cuID={cuId} t={t} handleClose={handleClose} />
        </Dropdown.Item>
        <Dropdown.Item
          fitted="vertically"
          icon="remove circle"
          onClick={removeItem}
          content={t('personal.removeLike')}
        />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default withTranslation()(Actions);
