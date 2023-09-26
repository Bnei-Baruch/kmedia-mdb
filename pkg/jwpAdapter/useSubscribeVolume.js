import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectors as player } from '../../lib/redux/slices/playerSlice/playerSlice';
import { noop } from '../../src/helpers/utils';
import { DEFAULT_PLAYER_VOLUME } from '../../lib/player/helper';

const useSubscribeVolume = () => {
  const { ready }             = useSelector(state => player.isReady(state.player));
  const [volume, setVolume] = useState(DEFAULT_PLAYER_VOLUME);
  const updateVolume        = ({ volume }) => setVolume(volume);

  useEffect(() => {
    if (!ready) return noop;

    const jwp = window.jwplayer();
    if (!jwp.on) return null;

    jwp.on('volume', updateVolume);
    setVolume(jwp.getVolume());

    return () => {
      const jwp = window.jwplayer();
      jwp.off && jwp.off('volume', updateVolume);
    };
  }, [ready]);

  return volume;
};

export default useSubscribeVolume;
