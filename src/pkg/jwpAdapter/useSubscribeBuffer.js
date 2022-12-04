import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectors as playlist } from '../../redux/modules/playlist';
import { selectors as player } from '../../redux/modules/player';
import { JWPLAYER_ID } from '../../helpers/consts';

const useSubscribeSeekAndTime = () => {
  const [buffPos, setBuffPos] = useState(0);

  const isReady  = useSelector(state => player.isReady(state.player));
  const file     = useSelector(state => player.getFile(state.player));
  const { cuId } = useSelector(state => playlist.getInfo(state.playlist));

  const checkBufferTime = d => setBuffPos(Math.round(d.bufferPercent));

  useEffect(() => {
    if (!isReady) return () => null;

    const p = window.jwplayer(JWPLAYER_ID);
    p.on('bufferChange', checkBufferTime);
    return () => {
      p.off('bufferChange', checkBufferTime);
      setBuffPos(0);
    };

  }, [isReady, file?.src, cuId]);

  return buffPos ;
};
export default useSubscribeSeekAndTime;
