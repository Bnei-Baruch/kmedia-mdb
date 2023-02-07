import React, { useEffect, useState } from 'react';
import { Popup } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as player, actions } from '../../../redux/modules/player';
import { formatDuration, stopBubbling } from '../../../helpers/utils';
import { useSubscribeSeekAndTime, useSubscribeBuffer } from '../../../pkg/jwpAdapter';
import { getDuration, seek } from '../../../pkg/jwpAdapter/adapter';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';

export const ProgressBar = ({ left, right }) => {
  const [activated, setActivated] = useState(false);

  const isReady = useSelector(state => player.isReady(state.player));

  const { pos, time } = useSubscribeSeekAndTime();
  const buffPos       = useSubscribeBuffer();

  const dispatch = useDispatch();

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
    // regard only left mouse button click (0). touch is undefined
    stopBubbling(e);
    !e.button && setActivated(true);
    dispatch(actions.setOverMode(PLAYER_OVER_MODES.dragKnob));
  };

  const handleEnd = e => {
    stopBubbling(e);
    setActivated(false);
    dispatch(actions.setOverMode(PLAYER_OVER_MODES.active));
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
