import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectors as playlist } from '../../redux/modules/playlist';
import { selectors as player } from '../../redux/modules/player';
import { JWPLAYER_ID } from '../../helpers/consts';
import { noop } from '../../helpers/utils';

const useSubscribeSeekAndTime = () => {
  const [pos, setPos]   = useState(0);
  const [time, setTime] = useState(0);

  const isReady  = useSelector(state => player.isReady(state.player));
  const file     = useSelector(state => player.getFile(state.player));
  const { cuId } = useSelector(state => playlist.getInfo(state.playlist));

  useEffect(() => {
    if (!isReady) return noop;

    const checkTimeAfterSeek = d => {
      if (!d?.duration) return;
      const time = Math.round(d.offset ?? d.currentTime);
      const pos  = Math.round(10 * (100 * time) / d.duration) / 10;
      setPos(pos);
      setTime(time);
    };

    const p = window.jwplayer(JWPLAYER_ID);
    p.on('seek', checkTimeAfterSeek);
    p.on('time', checkTimeAfterSeek);
    return () => {
      setPos(0);
      setTime(0);
      p.off('seek', checkTimeAfterSeek);
      p.off('time', checkTimeAfterSeek);
    };

  }, [isReady, file?.src, cuId]);

  return { pos, time };
};
export default useSubscribeSeekAndTime;