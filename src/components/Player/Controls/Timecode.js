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
  const timeRef  = useRef({ time, count: 0 });

  useEffect(() => {
    if (time === timeRef.current.time) return;
    timeRef.current.time = time;
    timeRef.current.count += 1;
    //save to localstorage on play only
    if (timeRef.current.count < 5) return;
    saveTimeOnLocalstorage(time, cuId);
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
