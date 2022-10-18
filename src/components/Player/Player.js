import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { initPlayerEvents, getSavedTime, findPlayedFile } from './helper';
import { selectors as player, actions } from '../../redux/modules/player';
import { JWPLAYER_ID } from '../../helpers/consts';
import { useLocation } from 'react-router-dom';
import { startEndFromQuery } from './Controls/helper';
import { selectors as playlist } from '../../redux/modules/playlist';
import isFunction from 'lodash/isFunction';

const Player = () => {
  const ref            = useRef();
  const dispatch       = useDispatch();
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

  const isReady = useSelector(state => player.isReady(state.player));

  const item = useSelector(state => playlist.getPlayed(state.playlist), shallowEqual);
  const info = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);
  const file = useMemo(() => findPlayedFile(item, info), [item, info]);

  const { cuId } = info;

  const checkStopTime = useCallback(d => {
    if (d.currentTime > end) {
      const player = window.jwplayer();
      player.pause();
      player.off('time', checkStopTime);
    }
  }, [end]);

  useEffect(() => {
    return () => {
      const player = window.jwplayer(JWPLAYER_ID);
      isFunction(player?.remove) && player.remove();
    };
  }, []);

  //init jwplayer by element id,
  useEffect(() => {
    if (file?.src) {
      const item = { 'file': file.src, image: file.image };
      if (!isReady) {
        const player = window.jwplayer(JWPLAYER_ID);
        player.setup({ controls: false, playlist: [item] });
        initPlayerEvents(dispatch);
      } else {
        const player = window.jwplayer();
        isFunction(player.load) && player.load([item]);
      }
      dispatch(actions.setFile(file));
    }
  }, [file, isReady]);

  //start and stop slice
  useEffect(() => {
    if (isReady && (start || end)) {
      const jwp = window.jwplayer(JWPLAYER_ID);
      jwp.play().seek(start).pause();
      jwp.on('time', checkStopTime);
    }
  }, [isReady, start, end]);

  //start from before saved time
  useEffect(() => {
    if (isReady && !start && !end) {
      const jwp  = window.jwplayer();
      const seek = getSavedTime(cuId);
      if (!isNaN(seek) && seek > 0) {
        jwp.play().seek(seek).pause();
      }
    }
  }, [isReady, cuId, start, end]);

  return (
    <div ref={ref}>
      <div id={JWPLAYER_ID}> video</div>
    </div>
  );
};

export default Player;
