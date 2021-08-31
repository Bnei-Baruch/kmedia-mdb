import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Confirm, Container, Header, Icon, Input } from 'semantic-ui-react';

import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import Link from '../../../Language/MultiLanguageLink';
import { ReactComponent as PlaylistPlayIcon } from '../../../../images/icons/playlist_play_black_24dp.svg';

const PlaylistHeader = ({ confirmSuccess, save, playlist, t }) => {
  const [isEditName, setIsEditName] = useState();
  const [name, setName]             = useState();
  const [confirm, setConfirm]       = useState();

  const { isMobileDevice } = useContext(DeviceInfoContext);

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

  const itemCount = playlist.playlist_items?.length || 0;
  const nameTag   = isEditName ? (
    <>
      <Input type="text" value={name} onChange={handleChangeName} maxLength={30} />
      <Button content={t('buttons.save')} onClick={handleSave} className="margin-right-8 margin-left-8" />
      <Button content={t('buttons.cancel')} onClick={toggleEditName} />
    </>
  ) : playlist.name;

  return (
    <Container>
      <div className="summary-container align_items_center">
        <Header as={isMobileDevice ? 'h3' : 'h2'} className="my_header">
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
            onConfirm={confirmSuccess}
            content={t('personal.confirmRemovePlaylist', { name: playlist.name })}
          />
          <Button basic onClick={remove} className="clear_button">
            <Icon name={'trash'} size="large" />
          </Button>
        </div>
      </div>
      <Link to={`/${MY_NAMESPACE_PLAYLISTS}/${playlist.id}`}>
        <Button basic className="clear_button">
          <Icon name={'play circle outline'} className="margin-left-8 margin-right-8" size="big" />
          {t('personal.playAll')}
        </Button>
      </Link>
    </Container>
  );
};

PlaylistHeader.propTypes = {
  playlist: PropTypes.object.isRequired,
  confirmSuccess: PropTypes.func,
  save: PropTypes.func
};

export default withNamespaces()(PlaylistHeader);
