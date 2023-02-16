import React from 'react';
import { Button } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { ShareBtn, SettingsBtn, FullscreenBtn } from './ControlBtns';
import { PrevBtn, NextBtn } from './NextPrevBtns';
import { SeekBackwardBtn, SeekForwardBtn } from './SeekBtns';
import PlayPauseBg from './PlayPauseBg';
import { Timecode } from './Timecode';
import CloseBtn from './CloseBtn';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import { selectors as player, selectors } from '../../../redux/modules/player';
import { ProgressCtrl } from './ProgressCtrl';
import MediaTypeControlMobile from '../Settings/MediaTypeControlMobile';
import { setMute } from '../../../pkg/jwpAdapter/adapter';
import { withTranslation } from 'react-i18next';

const ControlsMobile = ({ fullscreenRef, t }) => {
  const mode    = useSelector(state => player.getOverMode(state.player));
  const isMuted = useSelector(state => player.isMuted(state.player));
  const loaded  = useSelector(state => selectors.isLoaded(state.player));

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
              {
                isMuted && (
                  <Button
                    onClick={() => setMute(false)}
                    className="unmute-btn"
                    size="tiny"
                    content={t('player.buttons.tap-to-unmute')}
                  />
                )
              }
              <SettingsBtn />
              <ShareBtn />
            </div>
          )
        }

        <div className="controls__bar">
          <PrevBtn />
          <div className="flex-spacer"></div>
          {loaded && (
            <>
              <SeekBackwardBtn />
              <PlayPauseBg />
              <SeekForwardBtn />
            </>
          )}
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

export default withTranslation()(ControlsMobile);
