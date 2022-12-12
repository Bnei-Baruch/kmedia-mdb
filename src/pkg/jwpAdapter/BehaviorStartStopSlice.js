import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { selectors as player } from '../../redux/modules/player';
import { JWPLAYER_ID } from '../../helpers/consts';
import { startEndFromQuery } from '../../components/Player/Controls/helper';
import { pause, seek } from './adapter';

const BehaviorStartStopSlice = () => {
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);
  const isReady        = useSelector(state => player.isReady(state.player));

  useEffect(() => {
    if (!isReady || (!start && !end))
      return () => null;

    const jwp = window.jwplayer(JWPLAYER_ID);

    const checkStopTime = d => {
      if (d.currentTime > end) {
        pause();
        jwp.off('time', checkStopTime);
      }
    };
    seek(start).pause();
    jwp.on('time', checkStopTime);

    return () => jwp.off('time', checkStopTime);
  }, [isReady, start, end]);
  return null;
};

export default BehaviorStartStopSlice;
