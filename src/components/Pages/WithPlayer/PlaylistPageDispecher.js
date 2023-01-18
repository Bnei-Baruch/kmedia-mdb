import React from 'react';

import { COLLECTION_DAILY_LESSONS, EVENT_TYPES, CT_LESSONS_SERIES } from '../../../helpers/consts';
import BuildPlaylistByUnit from './BuildPlaylistByUnit';
import PlaylistPage from './Playlist/PlaylistPage';
import BuildPlaylistByCollectionByParams from './BuildPlaylistByCollectionByParams';
import PlayerContainer from '../../Player/PlayerContainer';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../../redux/modules/playlist';
import SingleMediaPage from './SingleMedia/SingleMediaPage';
import { withTranslation } from 'react-i18next';
import WipErr from '../../shared/WipErr/WipErr';
import { Icon } from 'semantic-ui-react';

export const PlaylistItemPageSeries = () => {
  const builder = <BuildPlaylistByUnit cts={[CT_LESSONS_SERIES]} />;
  return <Decorator builder={builder} />;
};

export const PlaylistItemPageLesson = ({ player }) => {
  const { isReady } = useSelector(state => playlist.getInfo(state.playlist));
  return (
    <>
      {<BuildPlaylistByUnit cts={COLLECTION_DAILY_LESSONS} />}
      {isReady ? <PlaylistPage playerContainer={player} /> : <Icon name="circle notch" color="blue" loading />}
    </>
  );
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

const PageSwitcher = withTranslation()(({ playerContainer, t }) => {
  const { isReady, isSingleMedia } = useSelector(state => playlist.getInfo(state.playlist));
  if (!isReady)
    return WipErr({ wip: !isReady, t });

  if (isSingleMedia)
    return <SingleMediaPage playerContainer={playerContainer} />;

  return <PlaylistPage playerContainer={playerContainer} />;
});
