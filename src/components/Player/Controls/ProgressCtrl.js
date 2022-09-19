import React, { useRef, useLayoutEffect, useState } from 'react';
import { ProgressBar } from './ProgressBar';
import { stopBubbling } from '../../../helpers/utils';
import { SlicesBar } from './SlicesBar';

export const ProgressCtrl = () => {
  const widthRef = useRef({});

  const [left, setLeft]   = useState();
  const [right, setRight] = useState();

  useLayoutEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right);
  }, [widthRef.current]);

  const handleProgressClick = e => {
    const clientX = (e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX) - 28/2;
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
      <div className="controls__slider" ref={widthRef}>
        <div className="slider__wrapper">
          <SlicesBar />
          <ProgressBar left={left + 12} right={right - 12} />
        </div>
      </div>
    </div>
  );
};
