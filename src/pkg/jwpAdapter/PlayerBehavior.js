import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { findPlayedFile } from '../../components/Player/helper';
import { selectors as player, actions, actions as playerActions } from '../../redux/modules/player';
import { selectors as playlist } from '../../redux/modules/playlist';
import { load, setup, init } from './adapter';
import { noop } from '../../helpers/utils';

const PlayerBehavior = () => {
  const dispatch = useDispatch();

  const isReady = useSelector(state => player.isReady(state.player));
  const wip     = useSelector(state => player.getWIP(state.player));

  const item    = useSelector(state => playlist.getPlayed(state.playlist), shallowEqual);
  const info    = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);
  const file    = useMemo(() => findPlayedFile(item, info), [item, info]);
  const prevSrc = useRef();

  //init jwplayer by element id,
  useEffect(() => {
    if (!file?.src || wip || !info.isReady || prevSrc.current === file.src)
      return noop;

    const item = { 'file': file.src, image: file.image };

    if (!isReady) {
      setup({
        controls: false,
        playlist: [item],
        preload: 'auto'
      });
      init(dispatch);
      dispatch(playerActions.setWIP(true));
    } else {
      load([item]);
    }
    dispatch(actions.setFile(file));

    prevSrc.current = file.src;

    //TODO its fix bug when c switch to cu - remove when <Player /> will be singleton
    return () => {
      isReady && (prevSrc.current = null);
    };

  }, [file, isReady, info.isReady, prevSrc]);

  return null;
};

export default PlayerBehavior;
