import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { initPlayerEvents, getSavedTime } from './helper';
import { selectors as player } from '../../redux/modules/player';
import { JWPLAYER_ID } from '../../helpers/consts';
import { useLocation } from 'react-router-dom';
import { startEndFromQuery } from './Controls/helper';
import { selectors as playlist } from '../../redux/modules/playlist';

const Player = ({ file }) => {
  const ref            = useRef();
  const dispatch       = useDispatch();
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

  const isReady      = useSelector(state => player.isReady(state.player));
  const { id: cuId } = useSelector(state => playlist.getPlayed(state.playlist));

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

  //start and stop slice
  useEffect(() => {
    if (isReady && !start && !end) {
      const player = window.jwplayer();
      const seek   = getSavedTime(cuId);
      if (!isNaN(seek)) {
        player.play().seek(seek).pause();
      }
    }
  }, [isReady, cuId, start, end]);

  console.log('volume', isReady && window.jwplayer().getVolume());
  return (
    <div ref={ref}>
      <div id={JWPLAYER_ID}> video</div>
    </div>
  );
};

//this component init jwplayer behaviors that must happen once only
export default React.memo(Player, () => true);
