import React from 'react';
import { ShareBtn, SettingsBtn, FullscreenBtn } from './ControlBtns';
import { PrevBtn, NextBtn } from './NextPrevBtns';
import { SeekBackwardBtn, SeekForwardBtn } from './SeekBtns';
import PlayPauseBg from './PlayPauseBg';
import { Timecode } from './Timecode';
import CloseBtn from './CloseBtn';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../../redux/modules/player';
import { ProgressCtrl } from './ProgressCtrl';
import MediaTypeControlMobile from '../Settings/MediaTypeControlMobile';

const ControlsMobile = ({ fullscreenRef }) => {

  const mode = useSelector(state => player.getOverMode(state.player));

  return (
    <>

      <div className="controls">
        {
          (mode === PLAYER_OVER_MODES.share) ? (
            <div className="controls__bar">
              <div className="flex-spacer"></div>
              <CloseBtn className="controls__close" />
            </div>
          ) : (
            <div className="controls__bar">
              <MediaTypeControlMobile />
              <div className="flex-spacer"></div>
              <SettingsBtn />
              <ShareBtn />
            </div>
          )
        }

        <div className="controls__bar">
          <PrevBtn />
          <div className="flex-spacer"></div>
          <SeekBackwardBtn />
          <PlayPauseBg />
          <SeekForwardBtn />
          <div className="flex-spacer"></div>
          <NextBtn />
        </div>
        <div className="controls__bar">
          <Timecode />
          <div className="flex-spacer"></div>
          <FullscreenBtn fullscreenRef={fullscreenRef} />
        </div>
      </div>
      <ProgressCtrl />
    </>
  );
};

export default ControlsMobile;
