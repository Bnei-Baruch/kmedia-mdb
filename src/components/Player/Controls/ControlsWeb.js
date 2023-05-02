import React from 'react';

import { SeekBackwardBtn, SeekForwardBtn } from './SeekBtns';
import { NextBtn, PrevBtn } from './NextPrevBtns';
import { FullscreenBtn, ShareBtn, SettingsBtn } from './ControlBtns';
import PlayPauseBtn from './PlayPauseBtn';
import VolumeCtrl from './VolumeCtrl';
import { Timecode } from './Timecode';
import { ProgressCtrl } from './ProgressCtrl';
import PlayPauseBg from './PlayPauseBg';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/player';

const ControlsWeb = ({ fullscreenRef }) => {
  const loaded = useSelector(state => selectors.isLoaded(state.player));

  return (
    <div className="controls">
      {loaded && < PlayPauseBg />}
      <PrevBtn />
      <SeekBackwardBtn />
      <SeekForwardBtn />
      <NextBtn />
      <div className="controls__bar">
        <PlayPauseBtn />
        <VolumeCtrl />
        <Timecode />
        <ProgressCtrl />
        <SettingsBtn />
        <ShareBtn />
        <FullscreenBtn fullscreenRef={fullscreenRef} />
      </div>
    </div>
  );
};

export default ControlsWeb;
