import React, { useEffect, useState, useCallback } from 'react';
import { Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../../redux/modules/player';
import { JWPLAYER_ID } from '../../../helpers/consts';

export const VolumeKnob = ({ left, right }) => {
  const [activated, setActivated] = useState(false);
  const [volume, setVolume]       = useState(0);

  const isReady = useSelector(state => player.isReady(state.player));

  const updateVolume = useCallback(({ volume }) => setVolume(volume), [setVolume]);

  useEffect(() => {
    if (!isReady) return () => null;

    const p = window.jwplayer(JWPLAYER_ID);
    p.on('volume', updateVolume);
    return () => p.off('volume', updateVolume);
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
    const v       = Math.round(100 * Math.min(Math.max(0, clientX - left), delta) / delta);
    window.jwplayer().setVolume(v);
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
          style={{ left: `${volume}%` }}
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
