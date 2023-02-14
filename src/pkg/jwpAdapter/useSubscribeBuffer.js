import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectors as playlist } from '../../redux/modules/playlist';
import { selectors as player } from '../../redux/modules/player';
import { noop } from '../../helpers/utils';

const useSubscribeBuffer = () => {
  const [buffPos, setBuffPos] = useState(0);

  const isReady  = useSelector(state => player.isReady(state.player));
  const file     = useSelector(state => player.getFile(state.player));
  const { cuId } = useSelector(state => playlist.getInfo(state.playlist));

  useEffect(() => {
    if (!isReady) return noop;
    const jwp = window.jwplayer();
    if (!jwp.on) return noop;

    const checkBufferTime = d => setBuffPos(Math.round(d.bufferPercent));
    jwp.on('bufferChange', checkBufferTime);
    return () => {
      const jwp = window.jwplayer();
      jwp.off && jwp.off('bufferChange', checkBufferTime);
      setBuffPos(0);
    };

  }, [isReady, file?.src, cuId]);

  return buffPos;
};
export default useSubscribeBuffer;
