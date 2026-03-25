import { useState, useRef, useEffect, useCallback } from 'react';

// Convert wpm to px/sec: calibrated so 120 wpm ≈ 1.4*4 px/sec
const WPM_TO_PX      = 1.4 / 30;
const SKIP_PX        = 60; // ~2 lines of text
export const MIN_WPM = 30;
export const MAX_WPM = 400;
const WPM_STEP       = 30;
const TIME_UPDATE_MS = 1000; // update remaining time every second

const LS_KEY = 'auto-scroll-wpm';

const loadWpm = () => {
  const saved = parseInt(localStorage.getItem(LS_KEY), 10);
  return saved && saved >= MIN_WPM && saved <= MAX_WPM ? saved : 100;
};

const calcMinsLeft = wpm => {
  const remainingPx = Math.max(0, document.body.scrollHeight - window.innerHeight - window.scrollY);
  return remainingPx / (wpm * WPM_TO_PX) / 60;
};

export const useAutoScroll = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [wpm, setWpmState]            = useState(loadWpm);
  const [minsLeft, setMinsLeft]       = useState(null);

  const rafRef         = useRef(null);
  const lastTimeRef    = useRef(null);
  const wpmRef         = useRef(loadWpm());
  const posRef         = useRef(0);
  const lastTimeUpdate = useRef(0);
  const tickRef        = useRef(null);

  tickRef.current = timestamp => {
    if (lastTimeRef.current !== null) {
      const dt        = (timestamp - lastTimeRef.current) / 1000;
      posRef.current += wpmRef.current * WPM_TO_PX * dt;
      window.scrollTo(0, posRef.current);

      // Update remaining time every second
      if (timestamp - lastTimeUpdate.current >= TIME_UPDATE_MS) {
        lastTimeUpdate.current = timestamp;
        setMinsLeft(calcMinsLeft(wpmRef.current));
      }

      // Auto-pause when reaching the bottom
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 2) {
        cancelAnimationFrame(rafRef.current);
        lastTimeRef.current = null;
        setIsScrolling(false);
        setMinsLeft(0);
        return;
      }
    }

    lastTimeRef.current = timestamp;
    rafRef.current      = requestAnimationFrame(tickRef.current);
  };

  const start = useCallback(() => {
    posRef.current      = window.scrollY;
    lastTimeRef.current = null;
    lastTimeUpdate.current = 0;
    setMinsLeft(calcMinsLeft(wpmRef.current));
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
    localStorage.setItem(LS_KEY, String(clamped));
    setWpmState(clamped);
    setMinsLeft(calcMinsLeft(clamped));
  }, []);

  const speedUp   = useCallback(() => setWpm(wpmRef.current + WPM_STEP), [setWpm]);
  const speedDown = useCallback(() => setWpm(wpmRef.current - WPM_STEP), [setWpm]);

  const skipForward  = useCallback(() => {
    posRef.current = window.scrollY + SKIP_PX;
    window.scrollTo(0, posRef.current);
    setMinsLeft(calcMinsLeft(wpmRef.current));
  }, []);

  const skipBackward = useCallback(() => {
    posRef.current = Math.max(0, window.scrollY - SKIP_PX);
    window.scrollTo(0, posRef.current);
    setMinsLeft(calcMinsLeft(wpmRef.current));
  }, []);

  // Compute initial estimate when panel opens (caller should trigger via setWpm or start)
  const calcNow = useCallback(() => setMinsLeft(calcMinsLeft(wpmRef.current)), []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return { isScrolling, wpm, minsLeft, calcNow, setWpm, speedUp, speedDown, start, pause, skipForward, skipBackward };
};
