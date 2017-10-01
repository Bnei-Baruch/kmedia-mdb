import React from 'react';
import PropTypes from 'prop-types';

import AVDuration from './AVDuration';

const AVTimeElapsed = (props) => {
  const { start, end } = props;

  return (
    <div className="player-control-time-elapsed">
      <AVDuration value={start} />&nbsp;/&nbsp;<AVDuration value={end} />
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

export default AVTimeElapsed;
