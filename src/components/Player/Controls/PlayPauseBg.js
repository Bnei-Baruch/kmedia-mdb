import React from 'react';
import { useSelector } from 'react-redux';

import { selectors } from '../../../redux/modules/player';
import { stopBubbling } from '../../../helpers/utils';
import { Icon } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { pause, play } from '../../../pkg/jwpAdapter/adapter';

const PlayPauseBg = ({ t }) => {
  const isPlay = useSelector(state => selectors.isPlay(state.player));

  const handleClick = e => {
    isPlay ? pause() : play().play();
    stopBubbling(e);
  };

  return (
    <WebWrapTooltip
      content={t(`player.controls.${isPlay ? 'pause' : 'play'}`)}
      trigger={
        <div className="controls__pause" onClick={handleClick}>
          <Icon fitted size="big" name={isPlay ? 'pause' : 'play'} />
        </div>
      }
    />
  );
};

export default withTranslation()(PlayPauseBg);
