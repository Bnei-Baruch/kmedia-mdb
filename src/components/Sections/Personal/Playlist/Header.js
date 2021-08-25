import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button, Container, Header, Icon, Input, Label } from 'semantic-ui-react';

import { actions } from '../../../../redux/modules/my';
import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import Link from '../../../Language/MultiLanguageLink';
import { ReactComponent as PlaylistPlayIcon } from '../../../../images/icons/playlist_play_black_24dp.svg';

const PlaylistHeader = ({ playlist, t }) => {
  const [isEditName, setIsEditName] = useState();
  const [name, setName]             = useState();

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

  const itemCount = playlist.playlist_items?.length || 0;
  const nameTag   = isEditName ? (
    <>
      <Input type="text" value={name} onChange={handleChangeName} maxLength={30} />
      <Button content={t('buttons.save')} onClick={save} className="margin-right-8 margin-left-8" />
      <Button content={t('buttons.cancel')} onClick={toggleEditName} />
    </>
  ) : (
    <>
      <Header as={'h2'} className="my_header">
        <PlaylistPlayIcon />
        <span>{playlist.name}</span>
      </Header>
      <Button basic onClick={toggleEditName} className="no-shadow vertical_bottom">
        <Icon name={'edit '} size="large" />
      </Button>
    </>
  );

  return (
    <Container>
      <div className="summary-container">
        <div>
          {nameTag}
          <Button basic onClick={toggleEditName} className="no-shadow no-margin">
            <Icon name={'trash'} size="large" />
          </Button>
        </div>
        <div>
          <Link to={`/${MY_NAMESPACE_PLAYLISTS}/${playlist.id}`}>
            <Icon name={'play circle outline'} className="margin-left-8 margin-right-8" size="large" />
            {t('personal.playAll')}
          </Link>
        </div>
      </div>
      <Label content={`${itemCount} ${t('pages.collection.items.programs-collection')}`} />
    </Container>
  );
};

PlaylistHeader.propTypes = {
  playlist: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default PlaylistHeader;
