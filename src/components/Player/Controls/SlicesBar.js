import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import { timeToPercent } from './helper';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import { playerGetFileSelector, playerGetOverModeSelector, playerGetShareStartEndSelector } from '../../../redux/selectors';

const htmlParamsByStartEnd = (duration, start, end) => {
  let width = 0;
  let left  = 0;
  if (duration && (start || end)) {
    left  = timeToPercent(start, duration);
    left  = Math.min(Math.max(left, 0), 99);
    width = timeToPercent(end - start, duration) || 100;
    width = Math.min(Math.max(width, 1), 100 - left);
  }

  return { width, left };
};

export const SlicesBar = () => {
  const [left, setLeft]   = useState(null);
  const [width, setWidth] = useState(null);

  const { start, end } = useSelector(playerGetShareStartEndSelector);
  const mode           = useSelector(playerGetOverModeSelector, shallowEqual);
  const isShare        = mode === PLAYER_OVER_MODES.share;

  const { duration } = useSelector(playerGetFileSelector);
  useEffect(() => {
    const { width: w, left: l } = htmlParamsByStartEnd(duration, start, end);
    setLeft(l);
    setWidth(w);
  }, [duration, start, end]);

  if (!isShare && start === 0 && end === Infinity)
    return null;

  return (
    <div
      className="slider__slice"
      style={{ left: `${left}%`, width: `${isShare && width === 0 ? 100 : width}%` }}
    ></div>
  );
};
