import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import { actions } from '../../../../redux/modules/my';
import { MY_NAMESPACE_HISTORY } from '../../../../helpers/consts';
import PlaylistInfo from '../../../Pages/WithPlayer/widgets/Info/PlaylistInfo';
import { getMyItemKey } from '../../../../helpers/my';
import { stopBubbling } from '../../../../helpers/utils';

const Actions = ({ history, t }) => {
  const [open, setOpen]          = useState();
  const dispatch                 = useDispatch();
  const { id, content_unit_uid } = history;
  const { key }                  = getMyItemKey(MY_NAMESPACE_HISTORY, history);

  const removeItem = e => {
    stopBubbling(e);
    dispatch(actions.remove(MY_NAMESPACE_HISTORY, { id, key }));
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
    <Dropdown className="cu_item_dropdown" icon={'ellipsis vertical'} onClose={handleClose} onOpen={handleOpen} open={open}>
      <Dropdown.Menu direction="left">
        <Dropdown.Item fitted="horizontally">
          <PlaylistInfo cuID={content_unit_uid} t={t} handleClose={handleClose} />
        </Dropdown.Item>
        <Dropdown.Item
          fitted="vertically"
          icon="remove circle"
          onClick={removeItem}
          content={t('personal.removeHistory')}
        />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default withNamespaces()(Actions);
