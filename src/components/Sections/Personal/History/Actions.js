import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, Confirm, Dropdown, List, Menu, Modal, Popup, Segment, Sidebar } from 'semantic-ui-react';

import { actions } from '../../../../redux/modules/my';
import { MY_NAMESPACE_HISTORY, MY_NAMESPACE_LIKES } from '../../../../helpers/consts';
import PlaylistInfo from '../../../Pages/Unit/widgets/Info/PlaylistInfo';

const Actions = ({ cuId, id, t }) => {
  const [open, setOpen]       = useState();
  const [confirm, setConfirm] = useState();

  const dispatch   = useDispatch();
  const removeItem = () => setConfirm(true);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleConfirmCancel = () => setConfirm(false);

  const handleConfirmSuccess = () => dispatch(actions.remove(MY_NAMESPACE_HISTORY, { ids: [id] }));

  return (
    <>
      <Confirm
        size="tiny"
        open={confirm}
        onCancel={handleConfirmCancel}
        onConfirm={handleConfirmSuccess}
        content={t('personal.confirmRemoveHistory')}
      />
      <Dropdown icon={'ellipsis vertical'} onClose={handleClose} onOpen={handleOpen} open={open}>
        <Dropdown.Menu>
          <Dropdown.Item fitted="horizontally">
            <PlaylistInfo cuID={cuId} t={t} handleClose={handleClose} />
          </Dropdown.Item>
          <Dropdown.Item
            as={'a'}
            fitted="vertically"
            icon="remove circle"
            onClick={removeItem}
            content={t('personal.removeHistory')}
          />
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default withNamespaces()(Actions);