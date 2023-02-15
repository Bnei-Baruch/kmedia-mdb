import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { selectors } from '../../../redux/modules/player';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { pause, play } from '../../../pkg/jwpAdapter/adapter';

const PlayPauseBtn = ({ t }) => {
  const isPlay = useSelector(state => selectors.isPlay(state.player));

  const handlePlayPause = () => {
    isPlay ? pause() : play();
  };

  return (
    <WebWrapTooltip
      content={t(`player.controls.${isPlay ? 'pause' : 'play'}`)}
      trigger={
        <div className="controls__play" onClick={handlePlayPause}>
          <Icon fitted name={isPlay ? 'pause' : 'play'} />
        </div>
      }
    />
  );
};

export default withNamespaces()(PlayPauseBtn);
