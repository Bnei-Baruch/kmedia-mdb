import React from 'react';
import { Card, Container, Header, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import UnitLogo from '../../../shared/Logo/UnitLogo';
import Link from '../../../Language/MultiLanguageLink';
import PlaylistPlayIcon from '../../../../images/icons/PlaylistPlay';
import { getMyItemKey } from '../../../../helpers/my';
import clsx from 'clsx';
import { selectors as settings } from '../../../../redux/modules/settings';

export const PlaylistItem = ({ item, t, language, asList = false }) => {
  const uiDir = useSelector(state => settings.getUIDir(state.settings));

  const link    = `/personal/${MY_NAMESPACE_PLAYLISTS}/${item.id}`;
  const { key } = getMyItemKey(MY_NAMESPACE_PLAYLISTS, item);

  const renderAsCard = () => (
    <Card as={Link} to={link} raised>
      <div className="my_playlist_item">
        <div className={`over_layer ${uiDir}`}>
          <Header as={'h2'}>{item.total_items}</Header>
          <PlaylistPlayIcon className="playlist_icon" fill="#FFFFFF" />
        </div>
        <UnitLogo unitId={item.poster_unit_uid || 'null'} width={700} />
      </div>
      <Card.Content>
        <Header size="medium" className="no-margin-top" content={item.name} />
      </Card.Content>
    </Card>
  );

  const renderAsList = () => (
    <Container
      as={Link}
      to={link}
      key={key}
      className={clsx('cu_item cu_item_list no-thumbnail')}
    >
      <div className="my_playlist_item">
        <div className="over_layer">
          <Header as={'h3'}>{item.total_items || 0}</Header>
          <Icon name="list" size="large" />
        </div>
        <UnitLogo unitId={item.poster_unit_uid || 'null'} width={165} />
      </div>
      <div className={`cu_item_info ${uiDir}`}>

        <Header as="h4" className="weight-normal no-margin-top">
          {item.name}
          <Header.Subheader>{`${item.total_items || 0} ${t('personal.videosOnList')}`}</Header.Subheader>
        </Header>
      </div>
    </Container>

  );
  return asList ? renderAsList() : renderAsCard();
};
