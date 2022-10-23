import React from 'react';
import { useParams } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import PlaylistContainer from '../../Pages/WithPlayer/Playlist/PlaylistContainer';

const PlaylistItemPageMusic = () => {
  const { id, cuId } = useParams();
  return <PlaylistContainer cId={id} cuId={cuId} />;
};

export default withNamespaces()(PlaylistItemPageMusic);
