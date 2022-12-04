import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../redux/modules/player';

const useSubscribeVolume = () => {
  const isReady = useSelector(state => player.isReady(state.player));

  const [volume, setVolume] = useState(isReady && window.jwplayer().getVolume());
  const [mute, setMute]     = useState(isReady && window.jwplayer().getMute());

  useEffect(() => {
    if (!isReady) return () => null;

    const updateVolume = ({ volume }) => setVolume(volume);
    const updateMute   = ({ mute }) => setMute(mute);

    const p = window.jwplayer();
    p.on('volume', updateVolume);
    p.on('mute', updateMute);
    setVolume(p.getVolume());

    return () => {
      p.off('volume', updateVolume);
      p.off('mute', updateMute);
    };
  }, [isReady]);

  return { volume, mute };
};
export default useSubscribeVolume;
