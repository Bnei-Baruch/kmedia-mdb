import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectors as player } from '../../../redux/modules/player';
import { timeToPercent, startEndFromQuery } from './helper';

export const SlicesBar = () => {
  const [left, setLeft]   = useState(0);
  const [width, setWidth] = useState(0);

  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

  const duration = useSelector(state => player.getFile(state.player).duration);

  useEffect(() => {
    if (duration && (start || end)) {
      let l = timeToPercent(start, duration);
      l     = Math.min(Math.max(l, 0), 99);
      let w = timeToPercent(end - start, duration) || 100;
      w     = Math.min(Math.max(w, 1), 100 - l);
      setLeft(l);
      setWidth(w);
    }
  }, [duration, start, end]);

  return (
    <div
      className="slider__slice"
      style={{ left: `${left}%`, width: `${width}%` }}
    ></div>
  );
};
