import React, { useEffect, useState } from 'react';
import { Popover, PopoverPanel } from '@headlessui/react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { actions } from '../../../redux/modules/player';
import { formatDuration, stopBubbling } from '../../../helpers/utils';
import { useSubscribeSeekAndTime, useSubscribeBuffer } from '../../../pkg/jwpAdapter';
import { getDuration, seek, isPlayerReady } from '../../../pkg/jwpAdapter/adapter';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import { playerGetOverModeSelector } from '../../../redux/selectors';

export const ProgressBar = ({ left, right }) => {
  const [activated, setActivated] = useState(false);

  const mode          = useSelector(playerGetOverModeSelector, shallowEqual);
  const { pos, time } = useSubscribeSeekAndTime();

  const buffPos  = useSubscribeBuffer();
  const dispatch = useDispatch();

  const isReady = isPlayerReady();
  useEffect(() => {
    if (isReady && activated) {
      document.addEventListener('mousemove', handleMove, { passive: false });
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('mouseup', handleEnd, { passive: false });
      document.addEventListener('touchend', handleEnd, { passive: false });
    }

    if (isReady && !activated) removeListeners();
    return removeListeners;
  }, [isReady, activated]);

  const handleStart = e => {
    stopBubbling(e);
    if (mode === PLAYER_OVER_MODES.active && !e.button)
      dispatch(actions.setOverMode(PLAYER_OVER_MODES.dragKnob));
    setActivated(true);
  };

  const handleEnd = e => {
    stopBubbling(e);
    setActivated(false);
    if (mode === PLAYER_OVER_MODES.dragKnob) {
      setTimeout(() => dispatch(actions.setOverMode(PLAYER_OVER_MODES.active)), 0);
    }
  };

  const handleMove = e => {
    stopBubbling(e);
    if (!activated) return;

    const clientX = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
    const delta   = right - left;
    const offset  = Math.min(Math.max(0, clientX - left), delta) / delta;

    seek(getDuration() * offset);
  };

  const removeListeners = () => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
  };

  return (
    <>
      <div
        className="slider__loaded"
        style={{ width: `${buffPos}%` }}
      ></div>
      <div
        className="slider__value"
        style={{ width: `${pos}%` }}
      ></div>
      <Popover
        as="div"
        className="slider__thumb"
        style={{ left: `${pos}%` }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onClick={stopBubbling}
      >
        {activated && (
          <PopoverPanel
            static
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded bg-gray-900 px-2 py-1 text-xs text-white whitespace-nowrap z-10 pointer-events-none"
          >
            <span>{formatDuration(time)}</span>
          </PopoverPanel>
        )}
      </Popover>
    </>
  );
};
