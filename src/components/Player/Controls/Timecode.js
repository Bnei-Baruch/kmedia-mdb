import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../../redux/modules/playlist';
import { formatDuration } from '../../../helpers/utils';
import { saveTimeOnLocalstorage } from './helper';
import { useSubscribeSeekAndTime, getDuration } from '../../../pkg/jwpAdapter';

export const Timecode = () => {
  const duration = getDuration();
  const cuId     = useSelector(state => playlist.getInfo(state.playlist).cuId);

  const { time } = useSubscribeSeekAndTime();

  useEffect(() => {
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
