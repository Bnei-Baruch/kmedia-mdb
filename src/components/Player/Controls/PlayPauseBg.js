import React from 'react';
import { useSelector } from 'react-redux';

import { selectors } from '../../../redux/modules/player';
import { JWPLAYER_ID } from '../../../helpers/consts';
import { stopBubbling } from '../../../helpers/utils';
import { Icon } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';
import WebWrapTooltip from '../../shared/WebWrapTooltip';

const PlayPauseBg = ({ t }) => {
  const isPlay = useSelector(state => selectors.isPlay(state.player));

  const handleClick = e => {
    const p = window.jwplayer(JWPLAYER_ID);
    isPlay ? p.pause() : p.play().play();
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

export default withNamespaces()(PlayPauseBg);
