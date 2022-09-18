import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../../redux/modules/player';
import { startEndFromQuery, timeToPercent } from './helper';

export const SlicesBar = () => {
  const [start, setStart] = useState();
  const [end, setEnd]     = useState();

  const location = useLocation();
  const isReady  = useSelector(state => player.isReady(state.player));

  useEffect(() => {
    if (isReady) {
      const { start, end } = startEndFromQuery(location);
      setStart(start);
      setEnd(end);
    }
  }, [isReady, location]);

  return (
    <div
      className="slider__slice"
      style={{
        left: `${timeToPercent(start)}%`,
        width: `${timeToPercent(end - start)}%`,
      }}
    ></div>
  );
};
