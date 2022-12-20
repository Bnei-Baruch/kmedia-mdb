import React from 'react';
import { Header } from 'semantic-ui-react';

import Page from './Page';
import { withTranslation } from 'react-i18next';
import useBuildMyPlaylist from './useBuildMyPlaylist';
import PlayerContainer from '../../../Player/PlayerContainer';

const PlaylistMyContainer = ({ t }) => {
  const isEmpty = useBuildMyPlaylist();
  if (isEmpty)
    return <Header size="large" content={t('personal.playlistNoResult')} />;

  const playerContainer = <PlayerContainer />;;
  return <Page playerContainer={playerContainer} />;
};

export default withTranslation()(PlaylistMyContainer);
