import { useRef } from 'react';
import { Control, usePlayerContext } from '@vime/react';
import { Icon } from 'semantic-ui-react';

export const VmJump = () => {
  const ref                           = useRef(null);
  const [currentTime, setCurrentTime] = usePlayerContext(ref, 'currentTime', 0);
  const [isPlaybackReady]             = usePlayerContext(ref, 'playbackReady', false);

  return (
    <Control
      ref={ref}
      disabled={!isPlaybackReady}
      style={{ '--vm-control-scale': 0.5, margin: '0 -2rem', }}
    >
      <span onClick={() => setCurrentTime(currentTime - 5)}>
        -5s<Icon name="backward" />
      </span>
      {' '}
      <span onClick={() => setCurrentTime(currentTime + 5)}>
        <Icon name="forward" />+5s
      </span>
    </Control>
  );
};
