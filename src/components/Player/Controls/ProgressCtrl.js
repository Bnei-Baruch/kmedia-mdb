import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SeekBarKnob } from './SeekBarKnob';
import { useSelector } from 'react-redux';
import { selectors as player } from '../../../redux/modules/player';
import { stopBubbling } from '../../../helpers/utils';

export const ProgressCtrl = () => {
  const widthRef = useRef({});

  const [pos, setPos]         = useState(0);
  const [buffPos, setBuffPos] = useState(0);
  const [left, setLeft]       = useState();
  const [right, setRight]     = useState();

  const isReady = useSelector(state => player.isReady(state.player));

  const checkStopTime = useCallback(d => {
    const pos = (100 * d.currentTime) / window.jwplayer().getDuration();
    setPos(pos);
  }, [setPos]);

  const checkBufferTime = useCallback(d => {
    const pos = (100 * d.currentTime) / window.jwplayer().getDuration();
    setBuffPos(pos);
  }, [setBuffPos]);

  useEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right);
  }, [widthRef.current]);

  useEffect(() => {
    if (!isReady) return () => null;

    const p = window.jwplayer();
    p.on('time', checkStopTime);
    p.on('seek', checkStopTime);
    p.on('bufferChange', checkBufferTime);

    return () => {
      p.off('time', checkStopTime);
      p.off('seek', checkStopTime);
      p.off('bufferChange', checkBufferTime);
    };
  }, [isReady]);

  const handleProgressClick = e => {
    const clientX = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
    const delta   = right - left;
    const offset  = Math.min(Math.max(0, clientX - left), delta) / delta;
    const p       = window.jwplayer();
    p.seek(p.getDuration() * offset).play().pause();
    stopBubbling(e);
  };

  return (
    <div
      className="controls__progress"
      onClick={handleProgressClick}
    >
      <div className="controls__slider">
        <div className="slider__wrapper" ref={widthRef}>
          <div className="slider__slice"></div>
          <div
            className="slider__loaded"
            style={{ width: `${buffPos}%` }}
          ></div>
          <div
            className="slider__value"
            style={{ width: `${pos}%` }}
          ></div>
          <SeekBarKnob left={left} right={right} />
        </div>
      </div>
    </div>
  );
};
