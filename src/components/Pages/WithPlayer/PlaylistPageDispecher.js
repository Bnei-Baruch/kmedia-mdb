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
import { useTranslation } from 'react-i18next';
import WipErr from '../../shared/WipErr/WipErr';
import { Icon } from 'semantic-ui-react';

export const PlaylistItemPageSeries = ({ playerContainer }) => {
  const builder = <BuildPlaylistByUnit cts={[CT_LESSONS_SERIES]} />;
  return <Decorator builder={builder} playerContainer={playerContainer} />;
};

export const PlaylistItemPageVirtual = ({ playerContainer }) => {
  const builder = <BuildPlaylistByUnit cts={[CT_VIRTUAL_LESSONS]} />;
  return <Decorator builder={builder} playerContainer={playerContainer} />;
};

export const PlaylistItemPageLesson = ({ playerContainer }) => {
  const { isReady } = useSelector(state => playlist.getInfo(state.playlist));
  return (
    <>
      {<BuildPlaylistByUnit cts={[...COLLECTION_DAILY_LESSONS, CT_VIRTUAL_LESSONS]} />}
      {isReady ? <PlaylistPage playerContainer={playerContainer} /> : <Icon name="circle notch" color="blue" loading />}
    </>
  );
};

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
  const { t }                      = useTranslation();
  const { isReady, isSingleMedia } = useSelector(state => playlist.getInfo(state.playlist));

  if (!isReady)
    return WipErr({ wip: !isReady, t });

  if (isSingleMedia)
    return <SingleMediaPage playerContainer={playerContainer} />;

  return <PlaylistPage playerContainer={playerContainer} />;
};
