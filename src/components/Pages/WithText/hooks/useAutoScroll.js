import { useState, useRef, useEffect, useCallback } from 'react';

const SKIP_PX        = 60; // ~2 lines of text
export const MIN_WPM     = 30;
export const MAX_WPM     = 400;
export const DEFAULT_WPM = 77;
const WPM_STEP       = 30;
const TIME_UPDATE_MS = 1000; // update remaining time every second
const LS_KEY         = 'auto-scroll-wpm';

const loadWpm = () => {
  const saved = parseInt(localStorage.getItem(LS_KEY), 10);
  return saved && saved >= MIN_WPM && saved <= MAX_WPM ? saved : DEFAULT_WPM;
};

const calcPxPerWord = () => {
  const scrollableH = Math.max(1, document.body.scrollHeight - window.innerHeight);
  const el          = document.querySelector('.font_settings.text__content');
  if (!el) return null;
  const wordCount = el.innerText.trim().split(/\s+/).filter(Boolean).length;
  return wordCount > 0 ? scrollableH / wordCount : null;
};

const calcMinsLeft = (wpm) => {
  const el = document.querySelector('.font_settings.text__content');
  if (!el) return null;
  const wordCount = el.innerText.trim().split(/\s+/).filter(Boolean).length;
  if (!wordCount) return null;
  const scrollableH      = Math.max(1, document.body.scrollHeight - window.innerHeight);
  const progress         = Math.min(1, window.scrollY / scrollableH);
  const remainingWords   = wordCount * (1 - progress);
  return remainingWords / wpm;
};

export const useAutoScroll = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [wpm, setWpmState]            = useState(loadWpm);
  const [minsLeft, setMinsLeft]       = useState(null);
  const [finished, setFinished]       = useState(false);

  const rafRef         = useRef(null);
  const lastTimeRef    = useRef(null);
  const wpmRef         = useRef(loadWpm());
  const posRef         = useRef(0);
  const pxPerWordRef   = useRef(null);
  const lastTimeUpdate = useRef(0);
  const lastPxUpdate   = useRef(0);
  const tickRef        = useRef(null);

  tickRef.current = timestamp => {
    if (timestamp - lastPxUpdate.current > 3000) {
      const px = calcPxPerWord();
      if (px) pxPerWordRef.current = px;
      lastPxUpdate.current = timestamp;
    }

    if (lastTimeRef.current !== null) {
      const dt          = (timestamp - lastTimeRef.current) / 1000;
      // Sync with manual scroll: if user scrolled more than 2px from our tracked position
      if (Math.abs(window.scrollY - posRef.current) > 2) posRef.current = window.scrollY;
      const pxPerSec    = pxPerWordRef.current
        ? wpmRef.current * pxPerWordRef.current / 60
        : wpmRef.current * (1.4 / 30);
      posRef.current   += pxPerSec * dt;
      window.scrollTo(0, posRef.current);

      if (timestamp - lastTimeUpdate.current >= TIME_UPDATE_MS) {
        lastTimeUpdate.current = timestamp;
        setMinsLeft(calcMinsLeft(wpmRef.current));
      }

      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 2) {
        cancelAnimationFrame(rafRef.current);
        lastTimeRef.current = null;
        setIsScrolling(false);
        setMinsLeft(0);
        setFinished(true);
        return;
      }
    }

    lastTimeRef.current = timestamp;
    rafRef.current      = requestAnimationFrame(tickRef.current);
  };

  const start = useCallback(() => {
    pxPerWordRef.current   = calcPxPerWord();
    lastPxUpdate.current   = 0;
    posRef.current         = window.scrollY;
    lastTimeRef.current    = null;
    lastTimeUpdate.current = 0;
    setFinished(false);
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
    const px = calcPxPerWord();
    if (px) pxPerWordRef.current = px;
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

  const calcNow = useCallback(() => {
    const px = calcPxPerWord();
    if (px) pxPerWordRef.current = px;
    setMinsLeft(calcMinsLeft(wpmRef.current));
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return { isScrolling, wpm, minsLeft, finished, calcNow, setWpm, speedUp, speedDown, start, pause, skipForward, skipBackward };
};
