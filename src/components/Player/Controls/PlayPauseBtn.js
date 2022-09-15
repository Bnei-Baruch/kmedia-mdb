import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { JWPLAYER_ID } from '../../../helpers/consts';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../../redux/modules/player';

export const PlayPauseBtn = () => {
  const isPlay = useSelector(state => player.isPlay(state.player));
  const p      = window.jwplayer(JWPLAYER_ID);

  const handlePlayPause = () => {
    isPlay ? p.pause() : p.play();
  };

  return (
    <Popup
      inverted
      size="mini"
      position="top left"
      content={isPlay ? 'Pause':'Play'}
      trigger={
        <div className="controls__play" onClick={handlePlayPause}>
          <Icon fitted name={isPlay ? 'pause' : 'play'} />
        </div>
      } />
  );
};
