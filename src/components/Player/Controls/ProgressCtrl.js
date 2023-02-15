import React, { useRef, useLayoutEffect, useState } from 'react';
import { ProgressBar } from './ProgressBar';
import { stopBubbling } from '../../../helpers/utils';
import { SlicesBar } from './SlicesBar';
import { useSelector, shallowEqual } from 'react-redux';
import { selectors as player } from '../../../redux/modules/player';
import { getDuration, seek } from '../../../pkg/jwpAdapter/adapter';

export const ProgressCtrl = () => {
  const widthRef = useRef({});

  const [left, setLeft]   = useState();
  const [right, setRight] = useState();

  //recount position on resize
  const width = useSelector(state => player.getPlayerWidth(state.player), shallowEqual);

  useLayoutEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right);
  }, [widthRef.current, width]);

  const handleProgressClick = e => {
    const clientX = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
    const delta   = right - left;
    const offset  = Math.min(Math.max(0, clientX - left), delta) / delta;
    seek(getDuration() * offset);
    stopBubbling(e);
  };

  return (
    <div
      className="controls__progress"
      onMouseDown={handleProgressClick}
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
