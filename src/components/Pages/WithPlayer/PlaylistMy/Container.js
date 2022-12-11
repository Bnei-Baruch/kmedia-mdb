import React from 'react';
import { Header } from 'semantic-ui-react';

import Page from './Page';
import { withNamespaces } from 'react-i18next';
import useBuildMyPlaylist from './useBuildMyPlaylist';

const PlaylistMyContainer = ({ t }) => {
  const isEmpty = useBuildMyPlaylist();
  if (isEmpty)
    return <Header size="large" content={t('personal.playlistNoResult')} />;

  return <Page />;
};

export default withNamespaces()(PlaylistMyContainer);
