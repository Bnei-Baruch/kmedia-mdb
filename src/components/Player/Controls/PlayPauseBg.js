import React from 'react';
import { useSelector } from 'react-redux';

import { selectors } from '../../../redux/modules/player';
import { JWPLAYER_ID } from '../../../helpers/consts';
import { stopBubbling } from '../../../helpers/utils';

const PlayPauseBg = () => {
  const isPlay = useSelector(state => selectors.isPlay(state.player));

  const handleClick = e => {
    const p = window.jwplayer(JWPLAYER_ID);
    isPlay ? p.pause() : p.play();
    stopBubbling(e);
  };

  return (
    <div className="controls__bg_play" onClick={handleClick}></div>
  );
};

export default PlayPauseBg;
