import React from 'react';

import { SeekBackwardBtn, SeekForwardBtn } from './SeekBtns';
import { NextBtn, PrevBtn } from './NextPrevBtns';
import { FullscreenBtn, ShareBtn, SettingsBtn } from './ControlBtns';
import PlayPauseBtn from './PlayPauseBtn';
import VolumeCtrl from './VolumeCtrl';
import { Timecode } from './Timecode';
import { ProgressCtrl } from './ProgressCtrl';
import PlayPauseBg from './PlayPauseBg';

const ControlsWeb = ({ fullscreenRef }) => {
  return (
    <div className="controls">
      <PrevBtn />
      <SeekBackwardBtn />
      <PlayPauseBg />
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
