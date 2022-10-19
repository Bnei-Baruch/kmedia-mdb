import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectors as player } from '../../../redux/modules/player';
import { startEndFromQuery, timeToPercent } from './helper';

export const SlicesBar = () => {
  const [left, setLeft]   = useState(0);
  const [width, setWidth] = useState(0);

  const location = useLocation();
  const duration = useSelector(state => player.getFile(state.player)?.duration);

  useEffect(() => {
    if (duration) {
      const { start, end } = startEndFromQuery(location);
      setLeft(timeToPercent(start, duration));
      setWidth(timeToPercent(end - start, duration));
    }
  }, [duration, location]);

  return (
    <div
      className="slider__slice"
      style={{ left: `${left}%`, width: `${width}%` }}
    ></div>
  );
};
