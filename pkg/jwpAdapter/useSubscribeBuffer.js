import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectors as playlist } from '../../lib/redux/slices/playlistSlice/playlistSlice';
import { selectors as player } from '../../lib/redux/slices/playerSlice/playerSlice';
import { noop } from '../../src/helpers/utils';
import { isPlayerReady } from './adapter';

const useSubscribeBuffer = () => {
  const [buffPos, setBuffPos] = useState(0);

  const file     = useSelector(state => player.getFile(state.player));
  const { cuId } = useSelector(state => playlist.getInfo(state.playlist));

  const isReady = isPlayerReady();
  useEffect(() => {
    if (!isReady) return noop;
    const jwp = window.jwplayer();

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
