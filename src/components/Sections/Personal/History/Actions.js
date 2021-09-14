import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import { actions } from '../../../../redux/modules/my';
import { MY_NAMESPACE_HISTORY } from '../../../../helpers/consts';
import PlaylistInfo from '../../../Pages/Unit/widgets/Info/PlaylistInfo';
import AlertModal from '../../../shared/AlertModal';

const Actions = ({ cuId, id, t }) => {
  const [open, setOpen]         = useState();
  const [alertMsg, setAlertMsg] = useState();
  const dispatch                = useDispatch();

  const removeItem = () => {
    dispatch(actions.remove(MY_NAMESPACE_HISTORY, { ids: [id] }));
    setAlertMsg(t('personal.removedHistory'));
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const onAlertCloseHandler = () => setAlertMsg(null);

  return (
    <>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={onAlertCloseHandler} />
      <Dropdown className="cu_item_dropdown" icon={'ellipsis vertical'} onClose={handleClose} onOpen={handleOpen} open={open}>
        <Dropdown.Menu direction="left">
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
