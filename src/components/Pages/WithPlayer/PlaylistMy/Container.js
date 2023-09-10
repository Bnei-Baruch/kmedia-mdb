import React from 'react';
import { Header } from 'semantic-ui-react';

import Page from './Page';
import { useTranslation } from 'next-i18next';
import useBuildMyPlaylist from './useBuildMyPlaylist';

const PlaylistMyContainer = ({ playerContainer }) => {
  const { t }   = useTranslation();
  const isEmpty = useBuildMyPlaylist();
  if (isEmpty)
    return <Header size="large" content={t('personal.playlistNoResult')} />;

  return <Page playerContainer={playerContainer} />;
};

export default PlaylistMyContainer;
