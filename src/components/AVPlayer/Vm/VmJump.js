import { useRef } from 'react';
import { Control, usePlayerContext } from '@vime/react';
import { Icon } from 'semantic-ui-react';

const onJump = (amount, currentTime, duration, setCurrentTime) => {
  let jumpTo = currentTime + amount;
  // Make sure we don't exceed the duration boundaries
  jumpTo     = Math.max(0, Math.min(jumpTo, duration));

  setCurrentTime(jumpTo);
};

export const VmJump = () => {
  const ref                           = useRef(null);
  const [currentTime, setCurrentTime] = usePlayerContext(ref, 'currentTime', 0);
  const [duration]                    = usePlayerContext(ref, 'duration', -1);
  const [isPlaybackReady]             = usePlayerContext(ref, 'playbackReady', false);

  return (
    <Control
      ref={ref}
      disabled={!isPlaybackReady}
      style={{ '--vm-control-scale': 0.5, margin: '0 -2rem', }}
    >
      <span onClick={() => onJump(-5, currentTime, duration, setCurrentTime)}>
        -5s<Icon name="backward" />
      </span>
      {' '}
      <span onClick={() => onJump(+5, currentTime, duration, setCurrentTime)}>
        <Icon name="forward" />+5s
      </span>
    </Control>
  );
};