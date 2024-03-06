import React, { useContext } from 'react';

import { SeekBackwardBtn, SeekForwardBtn } from './SeekBtns';
import { NextBtn, PrevBtn } from './NextPrevBtns';
import { FullscreenBtn, ShareBtn, SettingsBtn } from './ControlBtns';
import PlayPauseBtn from './PlayPauseBtn';
import VolumeCtrl from './VolumeCtrl';
import { Timecode } from './Timecode';
import { ProgressCtrl } from './ProgressCtrl';
import PlayPauseBg from './PlayPauseBg';
import { useSelector } from 'react-redux';
import { PlayerContext } from '../PlayerContainer';
import { playerIsLoadedSelector } from '../../../redux/selectors';

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
