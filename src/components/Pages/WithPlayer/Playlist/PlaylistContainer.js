import React from 'react';

import Page from './Page';
import BuildPlaylistByUnit from './BuildPlaylistByUnit';
import BuildPlaylistByCollection from '../BuildPlaylistByCollection';
import PlayerContainer from '../../../Player/PlayerContainer';

const PlaylistContainer = ({ byUnit, cts }) => {
  const playerContainer = <PlayerContainer />;
  return (
    <>
      {
        byUnit ? <BuildPlaylistByUnit cts={cts} /> : <BuildPlaylistByCollection />
      }
      <Page playerContainer={playerContainer} />
    </>
  );
};

export default PlaylistContainer;
