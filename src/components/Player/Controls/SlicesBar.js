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
      setLeft(timeToPercent(start, duration));
      setWidth(timeToPercent(end - start, duration));
    }
  }, [duration, start, end]);

  return (
    <div
      className="slider__slice"
      style={{ left: `${left}%`, width: `${width}%` }}
    ></div>
  );
};
