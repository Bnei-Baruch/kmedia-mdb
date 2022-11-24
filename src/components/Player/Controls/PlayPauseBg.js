import React from 'react';
import { useSelector } from 'react-redux';

import { selectors } from '../../../redux/modules/player';
import { JWPLAYER_ID } from '../../../helpers/consts';
import { stopBubbling } from '../../../helpers/utils';
import { Popup, Icon } from 'semantic-ui-react';

const PlayPauseBg = () => {
  const isPlay = useSelector(state => selectors.isPlay(state.player));

  const handleClick = e => {
    const p = window.jwplayer(JWPLAYER_ID);
    isPlay ? p.pause() : p.play().play();
    stopBubbling(e);
  };

  return (
    <Popup content="Pause video" inverted size="mini" position="top center" trigger={
      <div className="controls__pause" onClick={handleClick}>
        <Icon fitted size="big" name={isPlay ? 'pause' : 'play'} />
      </div>
    } />
  );
};

export default PlayPauseBg;
