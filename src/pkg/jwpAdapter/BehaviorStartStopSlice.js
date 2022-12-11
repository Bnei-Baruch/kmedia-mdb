import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { selectors as player } from '../../redux/modules/player';
import { JWPLAYER_ID } from '../../helpers/consts';
import { startEndFromQuery } from '../../components/Player/Controls/helper';
import { pause } from './adapter';

const BehaviorStartStopSlice = () => {
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);
  const isReady        = useSelector(state => player.isReady(state.player));

  const checkStopTime = d => {
    if (d.currentTime > end) {
      const player = window.jwplayer();
      pause();
      player.off('time', checkStopTime);
    }
  };

  useEffect(() => {
    if (isReady && (start || end)) {
      const jwp = window.jwplayer(JWPLAYER_ID);
      jwp.seek(start).pause();
      jwp.on('time', checkStopTime);
    }
  });
  return null;
};

export default BehaviorStartStopSlice;
