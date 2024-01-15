import React from 'react';

import {
  COLLECTION_DAILY_LESSONS,
  EVENT_TYPES,
  CT_LESSONS_SERIES,
  COLLECTION_PROGRAMS_TYPE,
  CT_VIRTUAL_LESSONS
} from '../../../helpers/consts';
import BuildPlaylistByUnit from './BuildPlaylistByUnit';
import PlaylistPage from './Playlist/PlaylistPage';
import BuildPlaylistByCollectionByParams from './BuildPlaylistByCollectionByParams';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../../redux/modules/playlist';
import SingleMediaPage from './SingleMedia/SingleMediaPage';

export const PlaylistItemPageSeries = ({ playerContainer }) => {
  const builder = <BuildPlaylistByUnit cts={[CT_LESSONS_SERIES]} />;
  return <Decorator builder={builder} playerContainer={playerContainer} />;
};

export const PlaylistItemPageVirtual = ({ playerContainer }) => {
  const builder = <BuildPlaylistByUnit cts={[CT_VIRTUAL_LESSONS]} />;
  return <Decorator builder={builder} playerContainer={playerContainer} />;
};

export const PlaylistItemPageLesson = ({ playerContainer }) => (
  <>
    {<BuildPlaylistByUnit cts={[...COLLECTION_DAILY_LESSONS, CT_VIRTUAL_LESSONS]} />}
    <PlaylistPage playerContainer={playerContainer} />
  </>
);

export const PlaylistItemPageEvent = ({ playerContainer }) => {
  const builder = <BuildPlaylistByUnit cts={EVENT_TYPES} />;
  return <Decorator builder={builder} playerContainer={playerContainer} />;
};

export const PlaylistItemPageProgram = ({ playerContainer }) => {
  const builder = <BuildPlaylistByUnit cts={COLLECTION_PROGRAMS_TYPE} />;
  return <Decorator builder={builder} playerContainer={playerContainer} />;
};

export const PlaylistCollectionPage = ({ playerContainer }) => {
  const builder = <BuildPlaylistByCollectionByParams />;
  return <Decorator builder={builder} playerContainer={playerContainer} />;
};

const Decorator = ({ builder, playerContainer }) => (
  <>
    {builder}
    <PageSwitcher playerContainer={playerContainer} />
  </>
);

const PageSwitcher = ({ playerContainer }) => {
  const { isSingleMedia } = useSelector(state => playlist.getInfo(state.playlist));

  if (isSingleMedia)
    return <SingleMediaPage playerContainer={playerContainer} />;

  return <PlaylistPage playerContainer={playerContainer} />;
};
