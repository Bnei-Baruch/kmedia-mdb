import React, { useContext } from 'react';
import { Icon } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { getPosition, seek } from '../../../pkg/jwpAdapter/adapter';
import { selectors as player } from '../../../redux/modules/player';
import { PlayerContext } from '../PlayerContainer';

const NORMAL_SEEK = 5;
const handleSeek  = pos => {
  const nPos = getPosition() + pos;
  seek(nPos > 0 ? nPos : 0);
};

export const SeekBackwardBtn = withTranslation()(({ t }) => {
  const ctx                = useContext(PlayerContext);
  const seek               = NORMAL_SEEK * useSelector(state => player.getKeyboardCoef(state.player));
  const handleSeekBackward = () => {
    handleSeek(-1 * seek);
    ctx.showControls();
  };
  return (
    <WebWrapTooltip
      content={t('player.controls.rewind', { seek })}
      closeOnTriggerClick={false}
      trigger={
        <div className="controls__rewind" onClick={handleSeekBackward}>
          <Icon fitted size="big" name="undo" />
        </div>
      }
    />
  );
});

export const SeekForwardBtn = withTranslation()(({ t }) => {
  const ctx               = useContext(PlayerContext);
  const seek              = NORMAL_SEEK * useSelector(state => player.getKeyboardCoef(state.player));
  const handleSeekForward = () => {
    handleSeek(seek);
    ctx.showControls();
  };
  return (
    <WebWrapTooltip
      content={t('player.controls.skip', { seek })}
      closeOnTriggerClick={false}
      trigger={
        <div className="controls__forward" onClick={handleSeekForward}>
          <Icon fitted size="big" name="redo" />
        </div>
      }
    />
  );
});
