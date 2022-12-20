import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import SingleMediaPage from './SingleMediaPage';
import PlayerContainer from '../../../Player/PlayerContainer';
import WipErr from '../../../shared/WipErr/WipErr';
import { selectors as playlist } from '../../../../redux/modules/playlist';
import BuildSingleMediaPlaylist from './BuildSingleMediaPlaylist';

const SingleMediaContainer = () => {
  const playerContainer = <PlayerContainer />;
  ;
  return (
    <>
      <BuildSingleMediaPlaylist />
      <PageSwitcher playerContainer={playerContainer} />
    </>
  );
};

const PageSwitcher = withTranslation()(({ playerContainer, t }) => {
  const { isReady } = useSelector(state => playlist.getInfo(state.playlist));

  if (!isReady)
    return WipErr({ wip: !isReady, t });

  return <SingleMediaPage playerContainer={playerContainer} />;
});

export default SingleMediaContainer;
