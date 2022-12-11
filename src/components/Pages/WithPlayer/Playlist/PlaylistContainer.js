import React from 'react';

import Page from './Page';
import BuildPlaylistByUnit from './BuildPlaylistByUnit';
import BuildPlaylistByCollection from '../BuildPlaylistByCollection';

const PlaylistContainer = ({ byUnit, cts }) => {
  return (
    <>
      {
        byUnit ? <BuildPlaylistByUnit cts={cts} /> : <BuildPlaylistByCollection />
      }
      <Page />
    </>
  );
};

export default PlaylistContainer;
