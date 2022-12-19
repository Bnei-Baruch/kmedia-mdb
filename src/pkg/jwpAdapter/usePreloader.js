import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors, actions, selectors as player } from '../../redux/modules/player';
import { JWPLAYER_ID } from '../../helpers/consts';

const usePreloader = () => {
  const loaded  = useSelector(state => selectors.isLoaded(state.player));
  const isReady = useSelector(state => player.isReady(state.player));

  const dispatch = useDispatch();
  useEffect(() => {
    if (loaded || !isReady) return null;

    const p = window.jwplayer(JWPLAYER_ID);

    const markAsLoaded = (e) => {
      dispatch(actions.setLoaded(true));
      p.off('meta', markAsLoaded);
      p.off('bufferFull', markAsLoaded);
    };
    p.on('meta', markAsLoaded);
    p.on('bufferFull', markAsLoaded);
    return () => {
      p.off('meta', markAsLoaded);
      p.off('bufferFull', markAsLoaded);
    };

  }, [loaded, isReady]);

  return loaded;
};

export default usePreloader;
