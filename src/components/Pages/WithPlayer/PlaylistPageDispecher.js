import React from 'react';

import { COLLECTION_DAILY_LESSONS, EVENT_TYPES, CT_LESSONS_SERIES } from '../../../helpers/consts';
import BuildPlaylistByUnit from './Playlist/BuildPlaylistByUnit';
import Page from './Playlist/Page';
import BuildPlaylistByCollectionByParams from './Playlist/BuildPlaylistByCollectionByParams';
import PlayerContainer from '../../Player/PlayerContainer';

export const PlaylistItemPageSeries = () => {
  const playerContainer = <PlayerContainer />;
  return (
    <>
      <BuildPlaylistByUnit cts={[CT_LESSONS_SERIES]} />
      <Page playerContainer={playerContainer} />
    </>
  );
};
export const PlaylistItemPageLesson = () => {
  const playerContainer = <PlayerContainer />;
  return (
    <>
      <BuildPlaylistByUnit cts={COLLECTION_DAILY_LESSONS} />
      <Page playerContainer={playerContainer} />
    </>
  );
};

export const PlaylistItemPageEvent = () => {
  const playerContainer = <PlayerContainer />;
  return (
    <>
      <BuildPlaylistByUnit cts={EVENT_TYPES} />
      <Page playerContainer={playerContainer} />
    </>
  );
};

export const PlaylistCollectionPage = () => {
  const playerContainer = <PlayerContainer />;
  return (
    <>
      <BuildPlaylistByCollectionByParams />
      <Page playerContainer={playerContainer} />§
    </>
  );
};
