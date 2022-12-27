import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../redux/modules/player';
import { noop } from '../../helpers/utils';
import { DEFAULT_PLAYER_VOLUME } from '../../components/Player/helper';
import { getMute } from './adapter';

const useSubscribeVolume = () => {
  const isReady             = useSelector(state => player.isReady(state.player));
  const [volume, setVolume] = useState(DEFAULT_PLAYER_VOLUME);
  const [mute, setMute]     = useState(false);

  useEffect(() => {
    if (!isReady) return noop;

    const updateVolume = ({ volume }) => setVolume(volume);
    const updateMute   = ({ mute }) => setMute(mute);

    const p = window.jwplayer();
    p.on('volume', updateVolume);
    p.on('mute', updateMute);
    setVolume(p.getVolume());
    setMute(p.getVolume());
    setMute(getMute());

    return () => {
      p.off('volume', updateVolume);
      p.off('mute', updateMute);
    };
  }, [isReady]);

  return { volume, mute };
};
export default useSubscribeVolume;
