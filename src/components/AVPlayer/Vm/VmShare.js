import { useRef } from 'react';
import { Control, usePlayerContext } from '@vime/react';
import { Icon } from 'semantic-ui-react';

export const VmShare = ({ onActivateSlice }) => {
  const ref               = useRef(null);
  const [isPlaybackReady] = usePlayerContext(ref, 'playbackReady', false);

  return (
    <Control
      ref={ref}
      disabled={!isPlaybackReady}
      style={{ '--vm-control-scale': 0.5, margin: '0 -0.8rem', }}
      onClick={onActivateSlice}
    >
      <Icon name="share alternate" />
    </Control>
  );
};
