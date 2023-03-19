import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { selectors as player } from '../../redux/modules/player';
import { startEndFromQuery } from '../../components/Player/Controls/helper';
import { pause, seek } from './adapter';
import { noop } from '../../helpers/utils';

const BehaviorStartStopSlice = () => {
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);
  const { id }         = useSelector(state => player.getFile(state.player)) || {};

  useEffect(() => {
    if (!id || (!start && end === Infinity)) return noop;

    const jwp = window.jwplayer();

    const checkStopTime = d => {
      if (d.currentTime > end) {
        pause();
        jwp.off('time', checkStopTime);
      }
    };

    seek(start);
    jwp.on('time', checkStopTime);

    return () => jwp.off('time', checkStopTime);
  }, [id, start, end]);
  return null;
};

export default BehaviorStartStopSlice;
