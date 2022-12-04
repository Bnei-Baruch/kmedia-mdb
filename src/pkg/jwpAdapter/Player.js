import React, { useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { findPlayedFile } from '../../components/Player/helper';
import { selectors as player, actions } from '../../redux/modules/player';
import { JWPLAYER_ID } from '../../helpers/consts';
import { selectors as playlist } from '../../redux/modules/playlist';
import isFunction from 'lodash/isFunction';
import useStartStopSlice from './useStartStopSlice';
import useStartPlay from './useStartPlay';
import { initPlayerEvents } from './adapter';

const Player = () => {
  const ref      = useRef();
  const dispatch = useDispatch();

  const isReady = useSelector(state => player.isReady(state.player));

  const item = useSelector(state => playlist.getPlayed(state.playlist), shallowEqual);
  const info = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);
  const file = useMemo(() => findPlayedFile(item, info), [item, info]);

  const { cuId } = info;

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

  useStartStopSlice();
  useStartPlay();
  return (
    <div ref={ref}>
      <div id={JWPLAYER_ID}></div>
    </div>
  );
};

export default Player;
