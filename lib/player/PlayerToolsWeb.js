import React from 'react';
import { useSelector } from 'react-redux';

import { selectors as player } from '../redux/slices/playerSlice/playerSlice';
import ControlsWeb from './Controls/ControlsWeb';
import Settings from './Settings/Settings';
import Sharing from './Sharing/Sharing';
import AudioBg from './AudioBg';
import Preloader from './Controls/Preloader';
import LabelVideo from './Sharing/LabelVideo';

const PlayerToolsWeb = ({ fullscreenRef }) => {
  const isReady = useSelector(state => player.isReady(state.player));

  return (
    <>
      <Preloader />
      {
        isReady && <>
          {/*<AudioBg />*/}
          <ControlsWeb fullscreenRef={fullscreenRef} />
          <Settings />
          <Sharing />
          <LabelVideo />
        </>
      }
    </>
  );

};

export default PlayerToolsWeb;
