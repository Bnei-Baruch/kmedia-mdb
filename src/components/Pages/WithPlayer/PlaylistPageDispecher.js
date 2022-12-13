import React from 'react';

import { COLLECTION_DAILY_LESSONS, EVENT_TYPES, CT_LESSONS_SERIES } from '../../../helpers/consts';
import BuildPlaylistByUnit from './BuildPlaylistByUnit';
import PlaylistPage from './Playlist/PlaylistPage';
import BuildPlaylistByCollectionByParams from './BuildPlaylistByCollectionByParams';
import PlayerContainer from '../../Player/PlayerContainer';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../../redux/modules/playlist';
import SingleMediaPage from './SingleMedia/SingleMediaPage';

export const PlaylistItemPageSeries = () => {
  const builder = <BuildPlaylistByUnit cts={[CT_LESSONS_SERIES]} />;
  return <Decorator builder={builder} />;
};

export const PlaylistItemPageLesson = () => {
  const builder = <BuildPlaylistByUnit cts={COLLECTION_DAILY_LESSONS} />;
  return <Decorator builder={builder} />;
};

export const PlaylistItemPageEvent = () => {
  const builder = <BuildPlaylistByUnit cts={EVENT_TYPES} />;
  return <Decorator builder={builder} />;
};

export const PlaylistCollectionPage = () => {
  const builder = <BuildPlaylistByCollectionByParams />;
  return <Decorator builder={builder} />;
};

const Decorator = ({ builder }) => {
  const playerContainer = <PlayerContainer />;
  return (
    <>
      {builder}
      <PageSwitcher playerContainer={playerContainer} />
    </>
  );
};

const PageSwitcher = ({ playerContainer }) => {
  const { isReady, isSingleMedia } = useSelector(state => playlist.getInfo(state.playlist));
  if (!isReady)
    return null;
  if (isSingleMedia)
    return <SingleMediaPage playerContainer={playerContainer} />;

  return <PlaylistPage playerContainer={playerContainer} />;
};
