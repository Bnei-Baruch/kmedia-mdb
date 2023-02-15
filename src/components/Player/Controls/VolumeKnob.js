import React, { useEffect, useState } from 'react';
import { Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { selectors as player } from '../../../redux/modules/player';
import { useSubscribeVolume } from '../../../pkg/jwpAdapter';
import { noop } from '../../../helpers/utils';

export const VolumeKnob = ({ onChangePosition }) => {
  const [activated, setActivated] = useState(false);
  const isReady                   = useSelector(state => player.isReady(state.player));
  const isMuted                   = useSelector(state => player.isMuted(state.player));
  const volume                    = useSubscribeVolume();

  const handleStart = e => {
    e.preventDefault();
    // regard only left mouse button click (0). touch is undefined
    !e.button && setActivated(true);
  };

  const handleMove = e => {
    if (!activated) return;

    onChangePosition(e);
  };

  useEffect(() => {
    if (!isReady) return noop;

    const handleEnd = e => {
      e.preventDefault();
      setActivated(false);
      removeListeners();
    };

    document.addEventListener('mousemove', handleMove, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd, { passive: false });
    document.addEventListener('touchend', handleEnd, { passive: false });

    const removeListeners = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
    return removeListeners;
  }, [isReady, activated]);

  return (
    <Popup
      trigger={
        <div
          className="slider__thumb"
          style={{ left: `${isMuted ? 0 : volume}%` }}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        ></div>
      }
      inverted
      size="mini"
      position="top center"
      open={activated}
    >
      <Popup.Content>
        <span>{`${volume} %`}</span>
      </Popup.Content>
    </Popup>
  );
};
