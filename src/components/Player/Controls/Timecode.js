import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { formatDuration } from '../../../helpers/utils';
import { saveTimeOnLocalstorage } from './helper';
import { useSubscribeSeekAndTime } from '../../../pkg/jwpAdapter';
import { getDuration } from '../../../pkg/jwpAdapter/adapter';
import { playlistGetInfoSelector } from '../../../redux/selectors';

export const Timecode = () => {
  const duration = getDuration();
  const { cuId } = useSelector(playlistGetInfoSelector);

  const { time } = useSubscribeSeekAndTime();
  const timeRef  = useRef(time);

  useEffect(() => {
    if (time === timeRef.current) return;
    saveTimeOnLocalstorage(time, cuId);
    timeRef.current = time;
  }, [time, cuId]);

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
