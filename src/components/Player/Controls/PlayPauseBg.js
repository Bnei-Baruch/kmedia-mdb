import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import { selectors, selectors as player } from '../../../redux/modules/player';
import { Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { pause, play, getPosition } from '../../../pkg/jwpAdapter/adapter';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { PLAYER_OVER_MODES, MT_AUDIO } from '../../../helpers/consts';

const PlayPauseBg = () => {
  const { t }    = useTranslation();
  const isPlay   = useSelector(state => selectors.isPlay(state.player));
  const mode     = useSelector(state => player.getOverMode(state.player));
  const { type } = useSelector(state => selectors.getFile(state.player)) || false;

  const { isIPhone } = useContext(DeviceInfoContext);

  const handleClick = e => {
    const pos = getPosition();
    isPlay ? pause() : isIPhone ? play().seek(pos).play() : play()?.play();
  };

  return (
    <div className="controls__pause_bg" onClick={handleClick}>
      {
        (mode === PLAYER_OVER_MODES.firstTime || type === MT_AUDIO) && (
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
