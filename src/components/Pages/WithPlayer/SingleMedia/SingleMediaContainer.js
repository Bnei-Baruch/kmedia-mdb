import React from 'react';

import SingleMediaPage from './SingleMediaPage';
import PlayerContainer from '../../../Player/PlayerContainer';
import BuildSingleMediaPlaylist from './BuildSingleMediaPlaylist';

const SingleMediaContainer = () => {
  const player = <PlayerContainer />;
  return <>
    <BuildSingleMediaPlaylist />
    <SingleMediaPage player={player} />
  </>;
};

export default SingleMediaContainer;
