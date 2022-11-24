import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { JWPLAYER_ID } from '../../../helpers/consts';
import { selectors as player } from '../../../redux/modules/player';

const PlayPauseBtn = ({ t }) => {
  const isPlay = useSelector(state => player.isPlay(state.player));

  const handlePlayPause = () => {
    const p = window.jwplayer(JWPLAYER_ID);
    isPlay ? p.pause() : p.play().play();
  };

  return (
    <Popup
      inverted
      size="mini"
      position="top left"
      content={t(`player.controls.${isPlay ? 'pause' : 'play'}`)}
      trigger={
        <div className="controls__play" onClick={handlePlayPause}>
          <Icon fitted name={isPlay ? 'pause' : 'play'} />
        </div>
      } />
  );
};

export default withNamespaces()(PlayPauseBtn);
