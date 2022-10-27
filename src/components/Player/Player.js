import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { initPlayerEvents, getSavedTime, findPlayedFile } from './helper';
import { selectors as player, actions } from '../../redux/modules/player';
import { JWPLAYER_ID, MY_NAMESPACE_HISTORY } from '../../helpers/consts';
import { useLocation } from 'react-router-dom';
import { startEndFromQuery } from './Controls/helper';
import { selectors as playlist } from '../../redux/modules/playlist';
import isFunction from 'lodash/isFunction';
import { selectors as my } from '../../redux/modules/my';

const Player = () => {
  const ref            = useRef();
  const dispatch       = useDispatch();
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

  const isReady = useSelector(state => player.isReady(state.player));
  const isPlay  = useSelector(state => player.isPlay(state.player));

  const item = useSelector(state => playlist.getPlayed(state.playlist), shallowEqual);
  const info = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);
  const file = useMemo(() => findPlayedFile(item, info), [item, info]);

  const { cuId, cId, isSingleMedia } = info;

  const historyItem = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY)?.find(x => x.content_unit_uid === cuId));
  const { fetched } = useSelector(state => my.getInfo(state.my, MY_NAMESPACE_HISTORY));

  const cuIdRef = useRef();

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
      jwp.seek(start).pause();
      jwp.on('time', checkStopTime);
    }
  }, [isReady, start, end]);

  //must be before next useEffect (don't autostart on change collection)
  useEffect(() => {
    cuIdRef.current = null;
  }, [cId]);

  //start from saved time on load or switch playlist item
  useEffect(() => {
    if (!isReady || start || end || cuId === cuIdRef.current || !fetched) return;

    const autoplay = !!cuIdRef.current || isPlay || isSingleMedia;
    const jwp      = window.jwplayer(JWPLAYER_ID);
    const seek     = getSavedTime(cuId, historyItem);

    if (!isNaN(seek) && seek > 0 && (seek + 10 < file.duration)) {
      jwp.seek(seek)[autoplay ? 'play' : 'pause']();
    } else if (autoplay) {
      jwp.play();
    }

    cuIdRef.current = cuId;
  }, [isReady, cuId, cuIdRef.current, isPlay, start, end, isSingleMedia, file.duration, historyItem, fetched]);

  return (
    <div ref={ref}>
      <div id={JWPLAYER_ID}></div>
    </div>
  );
};

export default Player;
