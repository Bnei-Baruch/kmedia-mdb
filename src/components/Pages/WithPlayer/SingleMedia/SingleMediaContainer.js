import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import SingleMediaPage from './SingleMediaPage';
import WipErr from '../../../shared/WipErr/WipErr';
import { selectors as playlist } from '../../../../redux/modules/playlist';
import BuildSingleMediaPlaylist from './BuildSingleMediaPlaylist';
import { useTranslation } from 'react-i18next';

const SingleMediaContainer = ({ playerContainer }) => (
  <>
    <BuildSingleMediaPlaylist />
    <PageSwitcher playerContainer={playerContainer} />
  </>
);
const PageSwitcher         = ({ playerContainer }) => {
  const { isReady } = useSelector(state => playlist.getInfo(state.playlist));
  const { t }       = useTranslation();

  if (!isReady)
    return WipErr({ wip: !isReady, t });

  return <SingleMediaPage playerContainer={playerContainer} />;
};

export default SingleMediaContainer;
