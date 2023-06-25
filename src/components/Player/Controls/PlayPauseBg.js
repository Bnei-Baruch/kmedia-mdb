import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import { selectors, selectors as player } from '../../../redux/modules/player';
import { Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { pause, play, getPosition } from '../../../pkg/jwpAdapter/adapter';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { PLAYER_OVER_MODES, MT_AUDIO } from '../../../helpers/consts';
import { PlayerContext } from '../PlayerContainer';

const PlayPauseBg = () => {
  const { t }                        = useTranslation();
  const ctx                          = useContext(PlayerContext);
  const { isIPhone, isMobileDevice } = useContext(DeviceInfoContext);

  const isPlay   = useSelector(state => selectors.isPlay(state.player));
  const mode     = useSelector(state => player.getOverMode(state.player));
  const { type } = useSelector(state => selectors.getFile(state.player)) || false;

  const handleClick     = e => {
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
                <Icon fitted size="big" name={isPlay ? 'pause' : 'play'} />
              </div>
            }
          />
        )
      }
    </div>
  );
};

export default PlayPauseBg;
