import React from 'react';
import { useSelector } from 'react-redux';

import { selectors as player } from '../../redux/modules/player';
import ControlsWeb from './Controls/ControlsWeb';
import Settings from './Settings/Settings';
import Sharing from './Sharing/Sharing';

const PlayerToolsWeb = ({ handleFullScreen }) => {
  const isPlayerReady = useSelector(state => player.isReady(state.player));

  if (!isPlayerReady) return null;

  return (
    <>
      <ControlsWeb openOnFull={handleFullScreen} />
      <Settings />
      <Sharing />
    </>
  );

};

export default PlayerToolsWeb;
