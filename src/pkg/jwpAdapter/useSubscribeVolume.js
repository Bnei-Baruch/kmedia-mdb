import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../redux/modules/player';
import { noop } from '../../helpers/utils';
import { DEFAULT_PLAYER_VOLUME } from '../../components/Player/helper';

const useSubscribeVolume = () => {
  const isReady             = useSelector(state => player.isReady(state.player));
  const [volume, setVolume] = useState(DEFAULT_PLAYER_VOLUME);

  useEffect(() => {
    if (!isReady) return noop;

    const updateVolume = ({ volume }) => setVolume(volume);

    const p = window.jwplayer();
    p.on('volume', updateVolume);
    setVolume(p.getVolume());

    return () => {
      p.off('volume', updateVolume);
    };
  }, [isReady]);

  return volume;
};
export default useSubscribeVolume;
