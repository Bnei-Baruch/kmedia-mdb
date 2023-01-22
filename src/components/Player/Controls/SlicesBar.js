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
    if (duration) {
      let l = timeToPercent(start, duration);
      l     = Math.max(Math.min(l, 0), 99);
      let w = timeToPercent(end - start, duration);
      w     = Math.max(Math.min(w, 1), 100 - l);
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
