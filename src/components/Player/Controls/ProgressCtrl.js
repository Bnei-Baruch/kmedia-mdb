import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import { stopBubbling } from '../../../helpers/utils';
import { SlicesBar } from './SlicesBar';
import { useSelector, shallowEqual } from 'react-redux';
import { getDuration, seek } from '../../../pkg/jwpAdapter/adapter';
import { playerGetPlayerWidthSelector } from '../../../redux/selectors';

export const ProgressCtrl = () => {
  // https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
  const [showChild, setShowChild] = useState(false);
  // Wait until after client-side hydration to show
  useEffect(() => setShowChild(true), []);

  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null;
  }

  return <Child/>;
};

const Child = () => {
  const widthRef = useRef({});

  const [left, setLeft]   = useState();
  const [right, setRight] = useState();

  //recount position on resize
  const width = useSelector(playerGetPlayerWidthSelector, shallowEqual);

  useLayoutEffect(() => {
    const { left, right } = widthRef.current.getBoundingClientRect();
    setLeft(left);
    setRight(right);
  }, [widthRef, width]);

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
          <SlicesBar/>
          <ProgressBar left={left} right={right}/>
        </div>
      </div>
    </div>
  );
};
