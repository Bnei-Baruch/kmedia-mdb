import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import { selectors } from '../../../redux/modules/player';
import { Icon } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { pause, play, getPosition } from '../../../pkg/jwpAdapter/adapter';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

const PlayPauseBg = ({ t }) => {
  const isPlay       = useSelector(state => selectors.isPlay(state.player));
  const { isIPhone } = useContext(DeviceInfoContext);

  const handleClick = e => {
    const pos = getPosition();
    isPlay ? pause() : isIPhone ? play().seek(pos).play() : play()?.play();
  };

  return (
    <div className="controls__pause_bg" onClick={handleClick}>
      <WebWrapTooltip
        content={t(`player.controls.${isPlay ? 'pause' : 'play'}`)}
        trigger={
          <div className="controls__pause">
            <Icon fitted size="big" name={isPlay ? 'pause' : 'play'} />
          </div>
        }
      />
    </div>
  );
};

export default withTranslation()(PlayPauseBg);
