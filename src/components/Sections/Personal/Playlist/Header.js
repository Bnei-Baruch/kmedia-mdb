import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button, Confirm, Container, Header, Icon, Input } from 'semantic-ui-react';

import { actions } from '../../../../redux/modules/my';
import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { ReactComponent as PlaylistPlayIcon } from '../../../../images/icons/playlist_play_black_24dp.svg';

const PlaylistHeader = ({ playlist, t }) => {
  const [isEditName, setIsEditName] = useState();
  const [name, setName]             = useState();
  const [confirm, setConfirm]       = useState();

  const history          = useHistory();
  const handleChangeName = (e, { value }) => setName(value);

  const toggleEditName = () => {
    setName(playlist.name);
    setIsEditName(!isEditName);
  };

  const dispatch = useDispatch();
  const save     = () => {
    dispatch(actions.edit(MY_NAMESPACE_PLAYLISTS, { id: playlist.id, name }));
    setIsEditName(false);
  };
  const remove   = () => setConfirm(true);

  const handleConfirmCancel = () => setConfirm(false);

  const handleConfirmSuccess = () => {
    dispatch(actions.remove(MY_NAMESPACE_PLAYLISTS, { ids: [playlist.id] }));
    //wait for remove from server
    setTimeout(() => history.push(history.location.pathname.split('/').slice(0, -2).join('/')), 100);
  };

  const itemCount = playlist.playlist_items?.length || 0;
  const nameTag   = isEditName ? (
    <>
      <Input type="text" value={name} onChange={handleChangeName} maxLength={30} />
      <Button content={t('buttons.save')} onClick={save} className="margin-right-8 margin-left-8" />
      <Button content={t('buttons.cancel')} onClick={toggleEditName} />
    </>
  ) : playlist.name;

  return (
    <Container>
      <div className="summary-container align_items_center">
        <Header as={'h2'} className="my_header">
          <PlaylistPlayIcon />
          {nameTag}
          <Header.Subheader className="display-iblock margin-right-8 margin-left-8">
            {`${itemCount} ${t('pages.collection.items.programs-collection')}`}
          </Header.Subheader>
        </Header>
        <div>
          <Button basic onClick={toggleEditName} className="clear_button">
            <Icon name={'edit '} size="large" />
          </Button>
          <Confirm
            size="tiny"
            open={confirm}
            onCancel={handleConfirmCancel}
            onConfirm={handleConfirmSuccess}
            content={t('personal.confirmRemovePlaylist')}
          />
          <Button basic onClick={remove} className="clear_button">
            <Icon name={'trash'} size="large" />
          </Button>
        </div>
      </div>

      <Button basic className="clear_button" href={`/${MY_NAMESPACE_PLAYLISTS}/${playlist.id}`}>
        <Icon name={'play circle outline'} className="margin-left-8 margin-right-8" size="big" />
        {t('personal.playAll')}
      </Button>
    </Container>
  );
};

PlaylistHeader.propTypes = {
  playlist: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default PlaylistHeader;
