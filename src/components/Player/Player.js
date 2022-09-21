import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { initPlayerEvents, removePlayerEvents } from './helper';
import { selectors as player } from '../../redux/modules/player';
import { JWPLAYER_ID } from '../../helpers/consts';
import { useLocation } from 'react-router-dom';
import { startEndFromQuery } from './Controls/helper';

const Player = ({ file }) => {
  const ref            = useRef();
  const dispatch       = useDispatch();
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

  const isReady       = useSelector(state => player.isReady(state.player));
  const checkStopTime = useCallback(d => {
    if (d.currentTime > end) {
      const player = window.jwplayer();
      player.pause();
      player.off('time', checkStopTime);
    }
  }, [end]);

  //init jwplayer by element id,
  useEffect(() => {
    // can't be init without file, but it must be call once
    const player = window.jwplayer(JWPLAYER_ID);

    console.log('Player check file on init', isReady);
    if (!isReady && file?.src) {
      player.setup({
        controls: false,
        playlist: [{ 'file': file.src }]
      });
      initPlayerEvents(dispatch);
    }

    return () => {
      player.remove();
    };
  }, [file?.src]);

  //start and stop slice
  useEffect(() => {
    const player = window.jwplayer(JWPLAYER_ID);

    if (isReady && (start || end)) {
      player.play().seek(start).pause();
      player.on('time', checkStopTime);
    }

    return () => {
      player.off('time', checkStopTime);
    };
  }, [isReady, start, end]);

  return (
    <div ref={ref}>
      <div id={JWPLAYER_ID}> video</div>
    </div>
  );
};

//this component init jwplayer behaviors that must happen once only
export default React.memo(Player, () => true);
