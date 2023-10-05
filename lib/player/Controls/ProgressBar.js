import React, { useEffect, useState } from 'react';
import { Popup } from 'semantic-ui-react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { selectors as player, actions, playerSlice } from '../../redux/slices/playerSlice/playerSlice';
import { formatDuration, stopBubbling } from '../../../src/helpers/utils';
import { useSubscribeSeekAndTime, useSubscribeBuffer } from '../../../pkg/jwpAdapter';
import { getDuration, seek, isPlayerReady } from '../../../pkg/jwpAdapter/adapter';
import { PLAYER_OVER_MODES } from '../../../src/helpers/consts';

export const ProgressBar = ({ left, right }) => {
  const [activated, setActivated] = useState(false);

  const mode          = useSelector(state => player.getOverMode(state.player), shallowEqual);
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
    // regard only left mouse button click (0). touch is undefined
    if (mode === PLAYER_OVER_MODES.active && !e.button)
      dispatch(playerSlice.actions.setOverMode(PLAYER_OVER_MODES.dragKnob));
    setActivated(true);
  };

  const handleEnd = e => {
    stopBubbling(e);
    setActivated(false);
    if (mode === PLAYER_OVER_MODES.dragKnob) {
      //need switch mode after event click will bubble
      setTimeout(() => dispatch(playerSlice.actions.setOverMode(PLAYER_OVER_MODES.active)), 0);
    }
  };

  const handleMove = e => {
    stopBubbling(e);
    if (!activated) return;

    // Resolve clientX from mouse or touch event.
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
      <Popup
        inverted
        size="mini"
        position="top center"
        open={activated}
        trigger={
          <div
            className="slider__thumb"
            style={{ left: `${pos}%` }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            onClick={stopBubbling}
          ></div>
        }
      >
        <Popup.Content>
          <span>{formatDuration(time)}</span>
        </Popup.Content>
      </Popup>
    </>
  );
};
