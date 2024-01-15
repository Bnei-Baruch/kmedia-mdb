import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import { Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { pause, play, getPosition } from '../../../pkg/jwpAdapter/adapter';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { PLAYER_OVER_MODES, MT_AUDIO } from '../../../helpers/consts';
import { PlayerContext } from '../PlayerContainer';
import { playerGetFileSelector, playerGetOverModeSelector, playerIsPlaySelector } from '../../../redux/selectors';

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
                <Icon fitted size="big" name={isPlay ? 'pause' : 'play'}/>
              </div>
            }
          />
        )
      }
    </div>
  );
};

export default PlayPauseBg;
