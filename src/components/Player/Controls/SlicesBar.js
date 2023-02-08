import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';

import { selectors as player, selectors } from '../../../redux/modules/player';
import { timeToPercent, startEndFromQuery } from './helper';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';

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
export const SlicesBar     = () => {
  const [left, setLeft]   = useState(null);
  const [width, setWidth] = useState(null);

  const location       = useLocation();
  const { start, end } = useSelector(state => selectors.getShareStartEnd(state.player));
  const mode           = useSelector(state => player.getOverMode(state.player), shallowEqual);
  const isShare        = mode === PLAYER_OVER_MODES.share;

  const { start: startQuery, end: endQuery } = startEndFromQuery(location);

  const duration = useSelector(state => player.getFile(state.player).duration);
  useEffect(() => {
    const { width: w, left: l } = htmlParamsByStartEnd(duration, startQuery, endQuery);
    setLeft(l);
    setWidth(w);
  }, [duration, startQuery, endQuery]);

  useEffect(() => {
    const { width: w, left: l } = htmlParamsByStartEnd(duration, start, end);
    if (isShare || w !== 100) {
      setLeft(l);
      setWidth(w);
    }
  }, [duration, start, end, isShare]);

  if (!isShare && !(startQuery || endQuery))
    return null;

  return (
    <div
      className="slider__slice"
      style={{ left: `${left}%`, width: `${width}%` }}
    ></div>
  );
};
