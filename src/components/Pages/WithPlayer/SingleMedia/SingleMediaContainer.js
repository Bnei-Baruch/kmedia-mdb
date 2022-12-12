import React from 'react';

import SingleMediaPage from './SingleMediaPage';
import PlayerContainer from '../../../Player/PlayerContainer';
import BuildSingleMediaPlaylist from './BuildSingleMediaPlaylist';

const SingleMediaContainer = () => {
  const playerContainer = <PlayerContainer />;
  return <>
    <BuildSingleMediaPlaylist />
    <SingleMediaPage playerContainer={playerContainer} />
  </>;
};

export default SingleMediaContainer;
