import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors, actions } from '../../redux/modules/player';
import { isPlayerReady } from './adapter';

const usePreloader = () => {
  const loaded  = useSelector(state => selectors.isLoaded(state.player));
  const isReady = isPlayerReady();

  const dispatch = useDispatch();
  useEffect(() => {
    if (loaded || !isReady) return undefined;
    const jwp = window.jwplayer();
    if (!jwp.on) return undefined;

    const markAsLoaded = e => {
      dispatch(actions.setLoaded(true));
      const jwp = window.jwplayer();
      if (jwp.off) {
        jwp.off('meta', markAsLoaded);
        jwp.off('bufferFull', markAsLoaded);
      }
    };

    jwp.on('meta', markAsLoaded);
    jwp.on('bufferFull', markAsLoaded);

    return () => {
      const jwp = window.jwplayer();
      if (jwp.off) {
        jwp.off('meta', markAsLoaded);
        jwp.off('bufferFull', markAsLoaded);
      }
    };

  }, [loaded, isReady, dispatch]);

  return loaded;
};

export default usePreloader;
