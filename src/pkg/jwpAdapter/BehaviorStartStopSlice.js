import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { selectors as playlist } from '../../redux/modules/playlist';
import { startEndFromQuery } from '../../components/Player/Controls/helper';
import { pause, seek } from './adapter';
import { selectors as player } from '../../redux/modules/player';
import { noop } from '../../helpers/utils';

const BehaviorStartStopSlice = () => {
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

  const { isHLS } = useSelector(state => playlist.getPlayed(state.playlist));

  const isReady         = useSelector(state => player.isReady(state.player));
  const isMetadataReady = useSelector(state => player.isMetadataReady(state.player));

  const _isReady = isHLS ? isMetadataReady : isReady;
  useEffect(() => {
    if (!_isReady || (!start && end === Infinity)) return noop;

    const jwp           = window.jwplayer();
    const checkStopTime = d => {
      if (d.currentTime > end) {
        pause();
        jwp.off('time', checkStopTime);
      }
    };

    seek(start);
    jwp.on('time', checkStopTime);

    return () => jwp.off('time', checkStopTime);
  }, [_isReady, start, end]);
  return null;
};

export default BehaviorStartStopSlice;
