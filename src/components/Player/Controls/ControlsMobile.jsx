import React from 'react';
import { useSelector } from 'react-redux';

import { ShareBtn, SettingsBtn, FullscreenBtn } from './ControlBtns';
import { PrevBtn, NextBtn } from './NextPrevBtns';
import { SeekBackwardBtn, SeekForwardBtn } from './SeekBtns';
import PlayPauseBg from './PlayPauseBg';
import { Timecode } from './Timecode';
import CloseBtn from './CloseBtn';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import { ProgressCtrl } from './ProgressCtrl';
import MediaTypeControlMobile from '../Settings/MediaTypeControlMobile';
import { setMute } from '../../../pkg/jwpAdapter/adapter';
import { useTranslation } from 'react-i18next';
import { playerGetOverModeSelector, playerIsLoadedSelector, playerIsMutedSelector } from '../../../redux/selectors';

const ControlsMobile = ({ fullscreenRef }) => {
  const { t } = useTranslation();
  const mode    = useSelector(playerGetOverModeSelector);
  const isMuted = useSelector(playerIsMutedSelector);
  const loaded  = useSelector(playerIsLoadedSelector);

  return (
    <>
      <div className="controls">
        {
          ([PLAYER_OVER_MODES.share, PLAYER_OVER_MODES.playlist, PLAYER_OVER_MODES.tagging].includes(mode)) ? (
            <div className="controls__bar">
              <div className="flex-spacer"></div>
              <CloseBtn className="controls__close"/>
            </div>
          ) : (
            <div className="controls__bar">
              <MediaTypeControlMobile/>
              <div className="flex-spacer"></div>
              {
                isMuted && (
                  <button
                    onClick={() => setMute(false)}
                    className="unmute-btn px-2 py-1 text-xs"
                  >
                    {t('player.buttons.tap-to-unmute')}
                  </button>
                )
              }
              <SettingsBtn/>
              <ShareBtn/>
            </div>
          )
        }

        <div className="controls__bar">
          <PrevBtn/>
          <div className="flex-spacer"></div>
          {loaded && (
            <>
              <SeekBackwardBtn/>
              <PlayPauseBg/>
              <SeekForwardBtn/>
            </>
          )}
          <div className="flex-spacer"></div>
          <NextBtn/>
        </div>
        <div className="controls__bar">
          <Timecode/>
          <div className="flex-spacer"></div>
          <FullscreenBtn fullscreenRef={fullscreenRef}/>
        </div>
      </div>
      <ProgressCtrl/>
    </>
  );
};

export default ControlsMobile;
