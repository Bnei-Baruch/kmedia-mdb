import React, { useEffect, useState, useCallback } from 'react';
import { Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../../redux/modules/player';
import { formatDuration } from '../../../helpers/utils';
import { JWPLAYER_ID } from '../../../helpers/consts';
import { selectors as playlist } from '../../../redux/modules/playlist';

export const ProgressBar = ({ left, right }) => {
  const [activated, setActivated] = useState(false);
  const [pos, setPos]             = useState(0);
  const [buffPos, setBuffPos]     = useState(0);
  const [time, setTime]           = useState(0);

  const isReady = useSelector(state => player.isReady(state.player));
  const file    = useSelector(state => player.getFile(state.player));
  const cuId    = useSelector(state => playlist.getInfo(state.playlist).cuId);

  const checkTimeAfterSeek = d => {
    const time = Math.round(d.currentTime);
    const pos  = Math.round(10 * (100 * time) / window.jwplayer().getDuration()) / 10;
    setPos(pos);
    setTime(time);
  };

  const checkBufferTime = d => setBuffPos(Math.round(d.bufferPercent));

  useEffect(() => {
    setPos(0);
    setBuffPos(0);
  }, [cuId]);

  useEffect(() => {
    if (!isReady) return () => null;

    const p = window.jwplayer(JWPLAYER_ID);

    p.on('seek', checkTimeAfterSeek);
    p.on('time', checkTimeAfterSeek);
    p.on('bufferChange', checkBufferTime);
    return () => {
      p.off('seek', checkTimeAfterSeek);
      p.off('time', checkTimeAfterSeek);
      p.off('bufferChange', checkBufferTime);
    };

  }, [isReady, file?.src]);

  const handleStart = e => {
    // regard only left mouse button click (0). touch is undefined
    !e.button && setActivated(true);
  };

  const handleEnd = e => setActivated(false);

  const handleMove = useCallback(e => {
    e.preventDefault();
    console.log('progress bar: move e.clientX', e.clientX);
    if (!activated) return;

    // Resolve clientX from mouse or touch event.
    const clientX = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
    const delta   = right - left;
    const offset  = Math.min(Math.max(0, clientX - left), delta) / delta;

    const p = window.jwplayer(JWPLAYER_ID);
    p.seek(p.getDuration() * offset);
  }, [activated]);

  const removeListeners = () => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
  };

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
    </>
  );
};
