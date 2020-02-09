import React from 'react';
import PropTypes from 'prop-types';

import { formatTime } from '../../helpers/time';

const AVDuration = React.memo(({ duration }) => <time>{formatTime(duration)}</time>);

const AVTimeElapsed = (props) => {
  const { start, end } = props;

  return (
    <div className="mediaplayer__timecode">
      <AVDuration duration={start} />
      {' '}
      /
      <AVDuration duration={end} />
    </div>
  );
};

AVTimeElapsed.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number
};

AVTimeElapsed.defaultProps = {
  start: undefined,
  end: undefined
};

// React.memo cannot help here because start is always changed during playback
export default AVTimeElapsed;
