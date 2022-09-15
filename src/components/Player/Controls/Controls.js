import React from 'react';

import { SeekBackwardBtn, SeekForwardBtn } from './SeekBtns';
import { NextBtn, PrevBtn } from './NextPrevBtns';
import { FullscreenBtn, ShareBtn, SettingsBtn } from './ControlBtns';
import { PlayPauseBtn } from './PlayPauseBtn';
import { VolumeCtrl } from './VolumeCtrl';
import { Timecode } from './Timecode';
import { ProgressCtrl } from './ProgressCtrl';

const Controls = ({fullScreen}) => {
  return (
    <div className="controls">
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
        <FullscreenBtn fullScreen={fullScreen} />
      </div>
    </div>
  );
};

export default Controls;
