import React from 'react';

import PlaylistPage from './PlaylistPage';
import BuildPlaylistByUnit from '../BuildPlaylistByUnit';
import BuildPlaylistByCollection from '../BuildPlaylistByCollection';
import PlayerContainer from '../../../Player/PlayerContainer';

const PlaylistContainer = ({ byUnit, cts }) => {
  const playerContainer = <PlayerContainer />;
  return (
    <>
      {
        byUnit ? <BuildPlaylistByUnit cts={cts} /> : <BuildPlaylistByCollection />
      }
      <PlaylistPage playerContainer={playerContainer} />
    </>
  );
};

export default PlaylistContainer;
