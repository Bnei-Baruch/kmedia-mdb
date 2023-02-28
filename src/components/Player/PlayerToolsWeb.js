import React from 'react';
import { useSelector } from 'react-redux';

import { selectors as player } from '../../redux/modules/player';
import ControlsWeb from './Controls/ControlsWeb';
import Settings from './Settings/Settings';
import Sharing from './Sharing/Sharing';
import AudioBg from './AudioBg';
import Preloader from './Controls/Preloader';

const PlayerToolsWeb = ({ fullscreenRef }) => {
  const isReady = useSelector(state => player.isReady(state.player));
  if (!isReady) return null;

  return (
    <>
      <AudioBg />
      <Preloader />
      <ControlsWeb fullscreenRef={fullscreenRef} />
      <Settings />
      <Sharing />
    </>
  );

};

export default PlayerToolsWeb;
