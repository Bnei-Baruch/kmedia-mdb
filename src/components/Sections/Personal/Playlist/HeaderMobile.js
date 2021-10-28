import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Confirm, Container, Header, Icon, Input } from 'semantic-ui-react';

import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import PlaylistPlayIcon from '../../../../images/icons/PlaylistPlay';
import Link from '../../../Language/MultiLanguageLink';

const PlaylistHeaderMobile = ({ confirmSuccess, save, playlist, t }) => {
  const [isEditName, setIsEditName] = useState();
  const [name, setName]             = useState();
  const [confirm, setConfirm]       = useState();

  const handleChangeName = (e, { value }) => setName(value);

  const toggleEditName = () => {
    setName(playlist.name);
    setIsEditName(!isEditName);
  };

  const handleSave = () => {
    save(name);
    setIsEditName(false);
  };

  const remove = () => setConfirm(true);

  const handleConfirmCancel = () => setConfirm(false);

  const nameTag = isEditName ? (
    <Header.Subheader>
      <Input type="text" value={name} onChange={handleChangeName} maxLength={30} />
      <Button
        color="green"
        icon="check"
        onClick={handleSave}
        className="margin-right-8 margin-left-8"
      />
      <Button
        icon="close"
        onClick={toggleEditName}
      />
    </Header.Subheader>
  ) : <Header.Content className="vertical_bottom">{playlist.name}</Header.Content>;

  return (
    <Container className="padded background_grey">
      <Header as={'h2'} className="my_header my_playlist_header">
        <PlaylistPlayIcon className="playlist_icon" />
        {nameTag}
        <Header.Subheader>
          {`${playlist.total_items} ${t('pages.collection.items.programs-collection')}`}
        </Header.Subheader>
      </Header>
      <div className="summary-container">
        <div>
          <Button basic onClick={toggleEditName} className="clear_button  margin-right-8 margin-left-8">
            <Icon name={'edit outline'} size="large" />
          </Button>
          <Confirm
            size="tiny"
            open={confirm}
            onCancel={handleConfirmCancel}
            onConfirm={confirmSuccess}
            content={t('personal.confirmRemovePlaylist', { name: playlist.name })}
          />
          <Button basic onClick={remove} className="clear_button">
            <Icon name={'trash alternate outline'} size="large" />
          </Button>
        </div>
        <Link to={`/${MY_NAMESPACE_PLAYLISTS}/${playlist.id}`}>
          <Button basic className="clear_button">
            <Icon name={'play circle outline'} className="margin-left-8 margin-right-8" size="big" />
            {t('personal.playAll')}
          </Button>
        </Link>
      </div>
    </Container>
  );
};

PlaylistHeaderMobile.propTypes = {
  playlist: PropTypes.object.isRequired,
  confirmSuccess: PropTypes.func,
  save: PropTypes.func
};

export default withNamespaces()(PlaylistHeaderMobile);
