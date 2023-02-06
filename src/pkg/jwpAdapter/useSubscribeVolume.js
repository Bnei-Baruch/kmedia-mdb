import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectors as player } from '../../redux/modules/player';
import { noop } from '../../helpers/utils';
import { DEFAULT_PLAYER_VOLUME } from '../../components/Player/helper';

const useSubscribeVolume = () => {
  const isReady             = useSelector(state => player.isReady(state.player));
  const [volume, setVolume] = useState(DEFAULT_PLAYER_VOLUME);
  const updateVolume        = ({ volume }) => setVolume(volume);

  useEffect(() => {
    if (!isReady) return noop;

    const jwp = window.jwplayer();
    jwp.on('volume', updateVolume);
    setVolume(jwp.getVolume());

    return () => {
      const jwp = window.jwplayer();
      jwp.off && jwp.off('volume', updateVolume);
    };
  }, [isReady]);

  return volume;
};

export default useSubscribeVolume;
