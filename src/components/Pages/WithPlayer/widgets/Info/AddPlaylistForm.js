import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Input, List } from 'semantic-ui-react';

import { actions } from '../../../../../redux/modules/my';
import { MY_NAMESPACE_PLAYLIST_EDIT } from '../../../../../helpers/consts';
import AlertModal from '../../../../shared/AlertModal';
import { stopBubbling } from '../../../../../helpers/utils';
import { useTranslation } from 'next-i18next';

const AddPlaylistForm = ({ close }) => {
  const { t } = useTranslation();

  const [alertMsg, setAlertMsg] = useState();
  const [name, setName]         = useState('');

  const dispatch = useDispatch();

  const handleSaveNewPlaylist = e => {
    stopBubbling(e);
    dispatch(actions.add(MY_NAMESPACE_PLAYLIST_EDIT, { name }));
    setAlertMsg(t('personal.newPlaylistSuccessful', { name }));
  };

  const onAlertCloseHandler = () => {
    setAlertMsg(null);
    close();
  };

  const handleNameChange = (e, { value }) => setName(value);

  return (
    <>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={onAlertCloseHandler} />
      <List.Item key="playlist_form">
        <List.Content floated="right">
          <Button
            color="green"
            icon="check"
            onClick={handleSaveNewPlaylist}
            disabled={!name}
          />
          <Button
            icon="close"
            onClick={close}
          />
        </List.Content>
        <List.Content>
          <Input
            fluid
            type="text"
            maxLength={30}
            onChange={handleNameChange}
            placeholder={t('personal.newPlaylistName')}
          />
        </List.Content>
      </List.Item>
    </>
  );
};

export default AddPlaylistForm;
