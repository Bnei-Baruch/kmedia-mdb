import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../../redux/modules/player';
import { formatDuration } from '../../../helpers/utils';
import isFunction from 'lodash/isFunction';

export const Timecode = () => {
  const [time, setTime] = useState(0);
  const duration        = isFunction(window.jwplayer()?.getDuration) ? window.jwplayer().getDuration() : 0;

  const isReady = useSelector(state => player.isReady(state.player));

  const checkTimeAfterSeek = useCallback(d => {
    const pos = (100 * d.currentTime) / duration;
    setTime(Math.round(d.currentTime));
  }, [setTime, duration]);

  useEffect(() => {
    if (!isReady) return () => null;

    const p = window.jwplayer();
    p.on('seek', checkTimeAfterSeek);
    p.on('time', checkTimeAfterSeek);
    return () => {
      p.off('seeked', checkTimeAfterSeek);
      p.off('time', checkTimeAfterSeek);
    };

  }, [isReady]);

  return (

    <div className="controls__timecode">
      <span className="current-timecode">
        {formatDuration(time)}
      </span>
      &nbsp;/&nbsp;
      <span className="media-length">
        {
          formatDuration(duration)
        }
      </span>
    </div>
  );
};
