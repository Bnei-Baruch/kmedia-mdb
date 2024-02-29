import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { noop } from '../../helpers/utils';
import { DEFAULT_PLAYER_VOLUME } from '../../components/Player/helper';
import { playerIsReadySelector } from '../../redux/selectors';

const useSubscribeVolume = () => {
  const isReady             = useSelector(playerIsReadySelector);
  const [volume, setVolume] = useState(DEFAULT_PLAYER_VOLUME);
  const updateVolume        = ({ volume }) => setVolume(volume);

  useEffect(() => {
    if (!isReady) return noop;

    const jwp = window.jwplayer();
    if (!jwp.on) return null;

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
