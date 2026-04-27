import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { MT_AUDIO, PLAYER_OVER_MODES } from '../../../helpers/consts';
import { getPosition, pause, play } from '../../../pkg/jwpAdapter/adapter';
import { playerGetFileSelector, playerGetOverModeSelector, playerIsPlaySelector } from '../../../redux/selectors';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { PlayerContext } from '../PlayerContainerClient';

const PlayPauseBg = () => {
  const { t }                        = useTranslation();
  const ctx                          = useContext(PlayerContext);
  const { isIPhone, isMobileDevice } = useContext(DeviceInfoContext);

  const isPlay   = useSelector(playerIsPlaySelector);
  const mode     = useSelector(playerGetOverModeSelector);
  const { type } = useSelector(playerGetFileSelector) || false;

  const handleClick = e => {
    const pos = getPosition();
    isPlay ? pause() : isIPhone ? play().seek(pos).play() : play()?.play();
  };

  const handleMouseMove = () => ctx.showControls();

  return (
    <div
      className="controls__pause_bg"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
    >
      {
        (mode === PLAYER_OVER_MODES.firstTime || type === MT_AUDIO || isMobileDevice) && (
          <WebWrapTooltip
            content={t(`player.controls.${isPlay ? 'pause' : 'play'}`)}
            trigger={
              <div className="controls__pause">
                <span className="material-symbols-outlined text-2xl">{isPlay ? 'pause' : 'play_arrow'}</span>
              </div>
            }
          />
        )
      }
    </div>
  );
};

export default PlayPauseBg;
