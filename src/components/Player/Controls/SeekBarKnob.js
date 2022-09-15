import React, { useEffect, useState, useCallback } from 'react';
import { Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../../redux/modules/player';
import { formatDuration } from '../../../helpers/utils';

export const SeekBarKnob = ({ left, right }) => {
  const [activated, setActivated] = useState(false);
  const [pos, setPos]             = useState(0);
  const [time, setTime]           = useState(0);

  const isReady = useSelector(state => player.isReady(state.player));

  const checkTimeAfterSeek = useCallback(d => {
    const pos = (100 * d.currentTime) / window.jwplayer().getDuration();
    setPos(pos);
    setTime(Math.round(d.currentTime));
  }, [setPos, setTime]);

  useEffect(() => {
    if (!isReady) return () => null;

    const p = window.jwplayer();
    p.on('seek', checkTimeAfterSeek);
    p.on('time', checkTimeAfterSeek);
    return () => {
      p.off('seeked', checkTimeAfterSeek);
      p.off('time', checkTimeAfterSeek);
    };

  }, [isReady]);

  const handleStart = e => {
    e.preventDefault();
    // regard only left mouse button click (0). touch is undefined
    !e.button && setActivated(true);
  };

  const handleMove = useCallback(e => {
    e.preventDefault();
    if (!activated) return;

    // Resolve clientX from mouse or touch event.
    const clientX = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
    const delta   = right - left;
    const offset  = Math.min(Math.max(0, clientX - left), delta) / delta;
    const p       = window.jwplayer();
    p.seek(p.getDuration() * offset);
  }, [activated]);

  useEffect(() => {
    if (!isReady) return () => null;

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
          style={{ left: `${pos}%` }}
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
        <span>{formatDuration(time)}</span>
      </Popup.Content>
    </Popup>
  );
};
