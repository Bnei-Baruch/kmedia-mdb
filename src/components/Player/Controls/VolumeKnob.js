import React, { useEffect, useState } from 'react';
import { Popover, PopoverPanel } from '@headlessui/react';
import { useSelector } from 'react-redux';

import { useSubscribeVolume } from '../../../pkg/jwpAdapter';
import { noop } from '../../../helpers/utils';
import { isPlayerReady } from '../../../pkg/jwpAdapter/adapter';
import { playerIsMutedSelector } from '../../../redux/selectors';

export const VolumeKnob = ({ onChangePosition }) => {
  const [activated, setActivated] = useState(false);
  const isMuted                   = useSelector(playerIsMutedSelector);
  const volume                    = useSubscribeVolume();

  const isReady     = isPlayerReady();
  const handleStart = e => {
    e.preventDefault();
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
    <Popover
      as="div"
      className="slider__thumb"
      style={{ left: `${isMuted ? 0 : volume}%` }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      {activated && (
        <PopoverPanel
          static
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded bg-gray-900 px-2 py-1 text-xs text-white whitespace-nowrap z-10 pointer-events-none"
        >
          <span>{`${volume} %`}</span>
        </PopoverPanel>
      )}
    </Popover>
  );
};
