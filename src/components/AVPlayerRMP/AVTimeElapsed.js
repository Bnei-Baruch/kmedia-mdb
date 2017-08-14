import React from 'react';

import AVDuration from './AVDuration';

const AVTimeElapsed = () => (
  <div className="player-control-time-elapsed">
    <AVDuration name={'currentTime'} />&nbsp;/&nbsp;<AVDuration name={'duration'} />
  </div>
);

export default AVTimeElapsed;
