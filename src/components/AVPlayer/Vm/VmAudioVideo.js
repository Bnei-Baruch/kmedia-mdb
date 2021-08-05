import { useRef } from 'react';
import { Control } from '@vime/react';
import classNames from 'classnames';

const onJump = (amount, currentTime, duration, setCurrentTime) => {
  let jumpTo = currentTime + amount;
  // Make sure we don't exceed the duration boundaries
  jumpTo     = Math.max(0, Math.min(jumpTo, duration));

  setCurrentTime(jumpTo);
};

export const VmAudioVideo = ({ isVideo, onSwitchAV }) => {
  const ref = useRef(null);

  return (
    <Control
      ref={ref}
      style={{ '--vm-control-scale': 0.5, margin: '0 -2.5rem' }}
      class={'mediaplayer__audiovideo'}
    >
      <span
        className={classNames({ 'is-active': !isVideo })}
        onClick={() => onSwitchAV('audio')}
      >audio</span>
      &nbsp;/&nbsp;
      <span
        className={classNames({ 'is-active': isVideo })}
        onClick={() => onSwitchAV('video')}
      >video</span>
    </Control>
  );
};
