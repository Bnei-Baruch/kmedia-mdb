import React, { useRef } from 'react';
import { Icon } from 'semantic-ui-react';
import { Control, usePlayerContext } from '@vime/react';

export const VmBigPlay = () => {
  const ref                 = useRef(null);
  const [paused, setPaused] = usePlayerContext(ref, 'paused', true);
  const icon                = paused ? 'play' : 'pause';
  const togglePlay          = () => {
    setPaused(!paused);
  };

  return (
    <Control
      ref={ref}
      pressed={!paused}
      onClick={() => togglePlay()}
    >
      <div className="mediaplayer__onscreen-play" style={{ padding: '12px', }}>
        <Icon name={icon} size="big" />
      </div>
    </Control>
  );
};
