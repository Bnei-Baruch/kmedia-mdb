import React, { useContext } from 'react';

import { useSelector } from 'react-redux';
import { playerIsLoadedSelector } from '../../../redux/selectors';
import { PlayerContext } from '../PlayerContainerClient';
import { FullscreenBtn, SettingsBtn, ShareBtn } from './ControlBtns';
import { NextBtn, PrevBtn } from './NextPrevBtns';
import PlayPauseBg from './PlayPauseBg';
import PlayPauseBtn from './PlayPauseBtn';
import { ProgressCtrl } from './ProgressCtrl';
import { SeekBackwardBtn, SeekForwardBtn } from './SeekBtns';
import { Timecode } from './Timecode';
import VolumeCtrl from './VolumeCtrl';

const ControlsWeb = ({ fullscreenRef }) => {

  const ctx    = useContext(PlayerContext);
  const loaded = useSelector(playerIsLoadedSelector);

  const handleMouseLeave = () => ctx.showControls();
  const handleMouseEnter = () => ctx.showControls(false);

  return (
    <div
      className="controls"
    >
      {loaded && <PlayPauseBg />}
      <PrevBtn />
      <SeekBackwardBtn />
      <SeekForwardBtn />
      <NextBtn />
      <div
        className="controls__bar"
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
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
