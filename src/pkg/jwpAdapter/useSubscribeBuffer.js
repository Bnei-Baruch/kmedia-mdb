import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { noop } from '../../helpers/utils';
import { isPlayerReady } from './adapter';
import { playerGetFileSelector, playlistGetInfoSelector } from '../../redux/selectors';

const useSubscribeBuffer = () => {
  const [buffPos, setBuffPos] = useState(0);

  const file     = useSelector(playerGetFileSelector);
  const { cuId } = useSelector(playlistGetInfoSelector);

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
