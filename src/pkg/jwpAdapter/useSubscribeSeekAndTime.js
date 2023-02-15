import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectors as playlist } from '../../redux/modules/playlist';
import { selectors as player } from '../../redux/modules/player';
import { noop } from '../../helpers/utils';

const useSubscribeSeekAndTime = () => {
  const [pos, setPos]   = useState(0);
  const [time, setTime] = useState(0);

  const isReady  = useSelector(state => player.isReady(state.player));
  const file     = useSelector(state => player.getFile(state.player));
  const { cuId } = useSelector(state => playlist.getInfo(state.playlist));

  useEffect(() => {
    if (!isReady) return noop;
    const jwp = window.jwplayer();
    if (!jwp.on) return null;

    const checkTimeAfterSeek = d => {
      if (d.duration === 0) return;
      const time = Math.round(d.offset ?? d.currentTime);
      const pos  = Math.round(10 * (100 * time) / d.duration) / 10;
      setPos(pos);
      setTime(time);
    };

    jwp.on('seek', checkTimeAfterSeek);
    jwp.on('time', checkTimeAfterSeek);
    return () => {
      setPos(0);
      setTime(0);
      const jwp = window.jwplayer();
      if (jwp.off) {
        jwp.off('seek', checkTimeAfterSeek);
        jwp.off('time', checkTimeAfterSeek);
      }
    };

  }, [isReady, file?.src, cuId]);

  return { pos, time };
};
export default useSubscribeSeekAndTime;
