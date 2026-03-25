import { useState, useRef, useEffect, useCallback } from 'react';

// Convert wpm to px/sec: calibrated so 120 wpm ≈ 1.4*4 px/sec
const WPM_TO_PX = 1.4 / 30;
const SKIP_PX   = 60; // ~2 lines of text
export const MIN_WPM = 30;
export const MAX_WPM = 400;
const WPM_STEP  = 30;

export const useAutoScroll = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [wpm, setWpmState]            = useState(120); // default: step 4

  const rafRef      = useRef(null);
  const lastTimeRef = useRef(null);
  const wpmRef      = useRef(120);
  const posRef      = useRef(0);
  const tickRef     = useRef(null);

  tickRef.current = timestamp => {
    if (lastTimeRef.current !== null) {
      const dt          = (timestamp - lastTimeRef.current) / 1000;
      posRef.current   += wpmRef.current * WPM_TO_PX * dt;
      window.scrollTo(0, posRef.current);

      // Auto-pause when reaching the bottom
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 2) {
        cancelAnimationFrame(rafRef.current);
        lastTimeRef.current = null;
        setIsScrolling(false);
        return;
      }
    }

    lastTimeRef.current = timestamp;
    rafRef.current      = requestAnimationFrame(tickRef.current);
  };

  const start = useCallback(() => {
    posRef.current      = window.scrollY;
    lastTimeRef.current = null;
    setIsScrolling(true);
    rafRef.current = requestAnimationFrame(tickRef.current);
  }, []);

  const pause = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    lastTimeRef.current = null;
    setIsScrolling(false);
  }, []);

  const setWpm = useCallback(value => {
    const clamped  = Math.min(MAX_WPM, Math.max(MIN_WPM, Math.round(value)));
    wpmRef.current = clamped;
    setWpmState(clamped);
  }, []);

  const speedUp   = useCallback(() => setWpm(wpmRef.current + WPM_STEP), [setWpm]);
  const speedDown = useCallback(() => setWpm(wpmRef.current - WPM_STEP), [setWpm]);

  const skipForward  = useCallback(() => {
    posRef.current = window.scrollY + SKIP_PX;
    window.scrollTo(0, posRef.current);
  }, []);

  const skipBackward = useCallback(() => {
    posRef.current = Math.max(0, window.scrollY - SKIP_PX);
    window.scrollTo(0, posRef.current);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return { isScrolling, wpm, setWpm, speedUp, speedDown, start, pause, skipForward, skipBackward };
};
