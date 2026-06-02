import React from 'react';

import Page from './Page';
import { useTranslation } from 'react-i18next';
import useBuildMyPlaylist from './useBuildMyPlaylist';

const PlaylistMyContainer = ({ playerContainer }) => {
  const { t }   = useTranslation();
  const isEmpty = useBuildMyPlaylist();
  if (isEmpty)
    return <h2 className="text-xl font-bold">{t('personal.playlistNoResult')}</h2>;

  return <Page playerContainer={playerContainer} />;
};

export default PlaylistMyContainer;
