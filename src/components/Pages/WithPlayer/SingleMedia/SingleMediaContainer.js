import React from 'react';
import { useSelector } from 'react-redux';

import SingleMediaPage from './SingleMediaPage';
import WipErr from '../../../shared/WipErr/WipErr';
import BuildSingleMediaPlaylist from './BuildSingleMediaPlaylist';
import { useTranslation } from 'react-i18next';
import { playlistGetInfoSelector } from '../../../../redux/selectors';

const SingleMediaContainer = ({ playerContainer }) => (
  <>
    <BuildSingleMediaPlaylist/>
    <PageSwitcher playerContainer={playerContainer}/>
  </>
);
const PageSwitcher         = ({ playerContainer }) => {
  const { isReady } = useSelector(playlistGetInfoSelector);
  const { t }       = useTranslation();

  if (!isReady)
    return WipErr({ wip: !isReady, t });

  return <SingleMediaPage playerContainer={playerContainer}/>;
};

export default SingleMediaContainer;
