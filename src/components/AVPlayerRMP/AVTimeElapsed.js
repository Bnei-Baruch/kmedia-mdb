import React from 'react';
import PropTypes from 'prop-types';

import AVDuration from './AVDuration';

const AVTimeElapsed = (props) => {
  const { isSlice, sliceEnd } = props;

  const endDurationProps = {};

  if (isSlice && sliceEnd) {
    endDurationProps.value = sliceEnd;
  } else {
    endDurationProps.name = 'duration';
  }

  return (
    <div className="player-control-time-elapsed">
      <AVDuration name="currentTime" />&nbsp;/&nbsp;<AVDuration {...endDurationProps} />
    </div>
  );
};

AVTimeElapsed.propTypes = {
  isSlice: PropTypes.bool,
  sliceStart: PropTypes.number,
  sliceEnd: PropTypes.number
};

AVTimeElapsed.defaultProps = {
  isSlice: false,
  sliceStart: undefined,
  sliceEnd: undefined
};

export default AVTimeElapsed;
