import React from 'react';
import { useSelector } from 'react-redux';

import { selectors } from '../../../redux/modules/player';
import { stopBubbling } from '../../../helpers/utils';
import { Icon } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { pause, play } from '../../../pkg/jwpAdapter/adapter';

const PlayPauseBg = ({ t }) => {
  const isPlay = useSelector(state => selectors.isPlay(state.player));

  const handleClick = e => {
    isPlay ? pause() : play()?.play();
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

export default withNamespaces()(PlayPauseBg);
