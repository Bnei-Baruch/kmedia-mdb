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
    <div className="controls__play">

      <WebWrapTooltip
        content={t(`player.controls.${isPlay ? 'pause' : 'play'}`)}
        trigger={
          <div onClick={handlePlayPause}>
            <span className="material-symbols-outlined">{isPlay ? 'pause' : 'play_arrow'}</span>
          </div>
        }
      />
    </div>
  );
};

export default PlayPauseBtn;
