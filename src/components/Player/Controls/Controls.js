import React from 'react';

import { SeekBackwardBtn, SeekForwardBtn } from './SeekBtns';
import { NextBtn, PrevBtn } from './NextPrevBtns';
import { FullscreenBtn, ShareBtn, SettingsBtn } from './ControlBtns';
import PlayPauseBtn from './PlayPauseBtn';
import VolumeCtrl from './VolumeCtrl';
import { Timecode } from './Timecode';
import { ProgressCtrl } from './ProgressCtrl';

const Controls = ({ openOnFull }) => {
  return (
    <div className="controls" dir="ltr">
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
        <FullscreenBtn openOnFull={openOnFull} />
      </div>
    </div>
  );
};

export default Controls;
