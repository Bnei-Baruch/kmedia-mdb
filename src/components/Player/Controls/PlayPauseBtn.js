import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { JWPLAYER_ID } from '../../../helpers/consts';
import { selectors as player } from '../../../redux/modules/player';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import pause, { play } from '../../../pkg/jwpAdapter';

const PlayPauseBtn = ({ t }) => {
  const isPlay = useSelector(state => player.isPlay(state.player));

  const handlePlayPause = () => {
    isPlay ? pause() : play().play();
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
