import React from 'react';

import { COLLECTION_DAILY_LESSONS, EVENT_TYPES, CT_LESSONS_SERIES } from '../../../helpers/consts';
import BuildPlaylistByUnit from './Playlist/BuildPlaylistByUnit';
import Page from './Playlist/Page';
import BuildPlaylistByCollectionByParams from './Playlist/BuildPlaylistByCollectionByParams';

export const PlaylistItemPageSeries = () => {
  return (
    <>
      <BuildPlaylistByUnit cts={[CT_LESSONS_SERIES]} />
      <Page />
    </>
  );
};
export const PlaylistItemPageLesson = () => {
  return (
    <>
      <BuildPlaylistByUnit cts={COLLECTION_DAILY_LESSONS} />
      <Page />
    </>
  );
};

export const PlaylistItemPageEvent = () => {
  return (
    <>
      <BuildPlaylistByUnit cts={EVENT_TYPES} />
      <Page />
    </>
  );
};

export const PlaylistCollectionPage = () => {
  return (
    <>
      <BuildPlaylistByCollectionByParams />
      <Page />
    </>
  );
};
