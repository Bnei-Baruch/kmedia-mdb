import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../../redux/modules/player';
import { selectors as playlist } from '../../../redux/modules/playlist';
import { formatDuration } from '../../../helpers/utils';
import isFunction from 'lodash/isFunction';
import { PLAYER_POSITION_STORAGE_KEY } from '../constants';
import { noop } from 'lodash/util';
import { JWPLAYER_ID } from '../../../helpers/consts';

export const Timecode = () => {
  const [time, setTime] = useState(0);
  const duration        = isFunction(window.jwplayer()?.getDuration) ? window.jwplayer().getDuration() : 0;

  const isReady = useSelector(state => player.isReady(state.player));
  const cuId    = useSelector(state => playlist.getInfo(state.playlist).cuId);

  useEffect(() => setTime(0), [cuId]);

  const checkTimeAfterSeek = d => {
    setTime(Math.round(d.currentTime));
    localStorage.setItem(`${PLAYER_POSITION_STORAGE_KEY}_${cuId}`, d.currentTime);
  };

  useEffect(() => {
    if (!isReady) return noop;

    const p = window.jwplayer(JWPLAYER_ID);
    p.on('seek', checkTimeAfterSeek);
    p.on('time', checkTimeAfterSeek);
    return () => {
      p.off('seek', checkTimeAfterSeek);
      p.off('time', checkTimeAfterSeek);
    };

  }, [isReady, cuId]);

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
