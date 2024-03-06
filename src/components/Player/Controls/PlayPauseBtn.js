import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { pause, play } from '../../../pkg/jwpAdapter/adapter';
import { playerIsPlaySelector } from '../../../redux/selectors';

const PlayPauseBtn = ({ t }) => {
  const isPlay = useSelector(playerIsPlaySelector);

  const handlePlayPause = () => {
    isPlay ? pause() : play();
  };

  return (
    <WebWrapTooltip
      content={t(`player.controls.${isPlay ? 'pause' : 'play'}`)}
      trigger={
        <div className="controls__play" onClick={handlePlayPause}>
          <Icon fitted name={isPlay ? 'pause' : 'play'}/>
        </div>
      }
    />
  );
};

export default withTranslation()(PlayPauseBtn);
