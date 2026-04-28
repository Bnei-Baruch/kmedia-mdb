import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { pause, play } from '../../../pkg/jwpAdapter/adapter';
import { playerIsPlaySelector } from '../../../redux/selectors';

const PlayPauseBtn = () => {
  const { t } = useTranslation();
  const isPlay = useSelector(playerIsPlaySelector);

  const handlePlayPause = () => {
    isPlay ? pause() : play();
  };

  return (
    <WebWrapTooltip
      content={t(`player.controls.${isPlay ? 'pause' : 'play'}`)}
      trigger={
        <div className="controls__play" onClick={handlePlayPause}>
          <span className="material-symbols-outlined text-base">{isPlay ? 'pause' : 'play_arrow'}</span>
        </div>
      }
    />
  );
};

export default PlayPauseBtn;
