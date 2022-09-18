import React, { useRef, useEffect, useState } from 'react';
import { ProgressBar } from './ProgressBar';
import { stopBubbling } from '../../../helpers/utils';
import { SlicesBar } from './SlicesBar';

export const ProgressCtrl = () => {
  const widthRef = useRef({});

  const [left, setLeft]   = useState();
  const [right, setRight] = useState();

  useEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right);
  }, [widthRef.current]);

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
          <SlicesBar />
          <ProgressBar left={left} right={right} />
        </div>
      </div>
    </div>
  );
};
