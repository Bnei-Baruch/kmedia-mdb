import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors, actions, selectors as player } from '../../redux/modules/player';
import { JWPLAYER_ID } from '../../helpers/consts';

const usePreloader = () => {
  const loaded  = useSelector(state => selectors.isLoaded(state.player));
  const isReady = useSelector(state => player.isReady(state.player));

  const dispatch = useDispatch();
  useEffect(() => {
    if (loaded !== false || !isReady) return null;

    const p = window.jwplayer(JWPLAYER_ID);

    const checkBufferTime = () => {
      dispatch(actions.setLoaded(true));
      p.off('bufferChange', checkBufferTime);
    };

    p.on('bufferChange', checkBufferTime);
    return () => p.off('bufferChange', checkBufferTime);

  }, [loaded, isReady]);

  return loaded;
};

export default usePreloader;
