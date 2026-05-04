import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { getPosition, seek } from '../../../pkg/jwpAdapter/adapter';
import { playerGetKeyboardCoefSelector } from '../../../redux/selectors';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { PlayerContext } from '../PlayerContainerClient';

const NORMAL_SEEK = 5;
const handleSeek = pos => {
  const nPos = getPosition() + pos;
  seek(nPos > 0 ? nPos : 0);
};

export const SeekBackwardBtn = () => {
  const { t } = useTranslation();
  const ctx = useContext(PlayerContext);
  const seek = NORMAL_SEEK * useSelector(playerGetKeyboardCoefSelector);
  const handleSeekBackward = () => {
    handleSeek(-1 * seek);
    ctx.showControls();
  };

  return (
    <div className="controls__rewind">
      <WebWrapTooltip
        content={t('player.controls.rewind', { seek })}
        trigger={
          <div onClick={handleSeekBackward}>
            <div className="material-symbols-outlined">undo</div>
          </div>
        }
      />
    </div>
  );
};

export const SeekForwardBtn = () => {
  const { t } = useTranslation();
  const ctx = useContext(PlayerContext);
  const seek = NORMAL_SEEK * useSelector(playerGetKeyboardCoefSelector);
  const handleSeekForward = () => {
    handleSeek(seek);
    ctx.showControls();
  };

  return (
    <div className="controls__forward">
      <WebWrapTooltip
        content={t('player.controls.skip', { seek })}
        trigger={
          <div onClick={handleSeekForward}>
            <div className="material-symbols-outlined">redo</div>
          </div>
        }
      />
    </div>
  );
};
