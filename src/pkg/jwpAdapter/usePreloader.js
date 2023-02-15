import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors, actions, selectors as player } from '../../redux/modules/player';

const usePreloader = () => {
  const loaded  = useSelector(state => selectors.isLoaded(state.player));
  const isReady = useSelector(state => player.isReady(state.player));

  const dispatch = useDispatch();
  useEffect(() => {
    if (loaded || !isReady) return null;
    const jwp = window.jwplayer();
    if (!jwp.on) return null;

    const markAsLoaded = (e) => {
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

  }, [loaded, isReady]);

  return loaded;
};

export default usePreloader;
