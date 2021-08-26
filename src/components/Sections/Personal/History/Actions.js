import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, List, Popup } from 'semantic-ui-react';

import { actions } from '../../../../redux/modules/my';
import { MY_NAMESPACE_HISTORY, MY_NAMESPACE_LIKES } from '../../../../helpers/consts';
import PlaylistInfo from '../../../Pages/Unit/widgets/Info/PlaylistInfo';

const Actions = ({ cuId, id, t }) => {
  const [open, setOpen] = useState();

  const dispatch   = useDispatch();
  const removeItem = () => dispatch(actions.remove(MY_NAMESPACE_HISTORY, { ids: [id] }));

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <Popup
      open={open}
      on="click"
      onClose={handleClose}
      content={t('messages.link-copied-to-clipboard')}
      position="bottom"
      trigger={<Button basic className="clear_button" icon={'ellipsis vertical'} onClick={handleOpen} />}
    >
      <List relaxed>
        <List.Item fitted="vertically">
          <PlaylistInfo cuID={cuId} t={t} />
        </List.Item>
        <List.Item
          as={'a'}
          fitted="vertically"
          icon="remove circle"
          onClick={removeItem}
          content={t('personal.removeLike')}
        />
      </List>
    </Popup>
  );
};

export default withNamespaces()(Actions);
