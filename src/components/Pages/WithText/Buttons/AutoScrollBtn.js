import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button, Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAutoScroll, MIN_WPM, MAX_WPM } from '../hooks/useAutoScroll';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';
import { settingsGetUIDirSelector } from '../../../../redux/selectors';

const TIP = 'top center';

const Tip = ({ textKey, children }) => {
  const { t } = useTranslation();
  return (
    <Popup
      content={t(`page-with-text.buttons.web.${textKey}`)}
      trigger={children}
      position={TIP}
      on="hover"
      inverted
      size="mini"
    />
  );
};

const AutoScrollBtn = () => {
  const { t }                                                                        = useTranslation();
  const [isOpen, setIsOpen]                                                          = useState(false);
  const { isScrolling, wpm, minsLeft, calcNow, setWpm, speedUp, speedDown, start, pause,
    skipForward, skipBackward }                                                       = useAutoScroll();
  const dir                                                                          = useSelector(settingsGetUIDirSelector);
  const isRTL                                                                        = dir === 'rtl';

  const [wpmInput, setWpmInput] = useState(String(wpm));

  useEffect(() => {
    setWpmInput(String(wpm));
  }, [wpm]);

  const handleClose = () => {
    if (isScrolling) pause();
    setIsOpen(false);
  };

  const commitWpm = val => {
    const n = parseInt(val, 10);
    if (!isNaN(n) && n > 0) setWpm(n);
    else setWpmInput(String(wpm));
  };

  const actionsRef   = useRef({});
  actionsRef.current = {
    togglePlay: () => isScrolling ? pause() : start(),
    speedUp,
    speedDown,
    skipForward,
    skipBackward,
  };

  useEffect(() => {
    const handleKey = e => {
      if (!isOpen && !isScrolling) return;
      switch (e.code) {
        case 'Space':      e.preventDefault(); actionsRef.current.togglePlay();   break;
        case 'ArrowUp':    e.preventDefault(); actionsRef.current.speedUp();      break;
        case 'ArrowDown':  e.preventDefault(); actionsRef.current.speedDown();    break;
        case 'ArrowRight': e.preventDefault(); actionsRef.current.skipForward();  break;
        case 'ArrowLeft':  e.preventDefault(); actionsRef.current.skipBackward(); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, isScrolling]);

  return (
    <>
      <ToolbarBtnTooltip
        textKey="auto-scroll"
        active={isOpen || isScrolling}
        icon={<span className="material-symbols-outlined auto-scroll-icon">slow_motion_video</span>}
        onClick={() => { setIsOpen(true); calcNow(); }}
        disabled={false}
      />

      {isOpen && createPortal(
        <div className={`auto-scroll-panel${isRTL ? ' auto-scroll-panel--rtl' : ''}`}>
          <Tip textKey="auto-scroll-close">
            <button className="auto-scroll-close" onClick={handleClose}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </Tip>

          <div className="auto-scroll-player">
            <Tip textKey="auto-scroll-skip-back">
              <Button icon className="auto-scroll-skip" onClick={skipBackward}>
                <span className="material-symbols-outlined">skip_previous</span>
              </Button>
            </Tip>
            <Tip textKey={isScrolling ? 'auto-scroll-pause' : 'auto-scroll-play'}>
              <Button icon circular className="auto-scroll-play-btn" onClick={() => isScrolling ? pause() : start()}>
                <span className="material-symbols-outlined">
                  {isScrolling ? 'pause' : 'play_arrow'}
                </span>
              </Button>
            </Tip>
            <Tip textKey="auto-scroll-skip-fwd">
              <Button icon className="auto-scroll-skip" onClick={skipForward}>
                <span className="material-symbols-outlined">skip_next</span>
              </Button>
            </Tip>
          </div>

          {minsLeft !== null && (
            <div className="auto-scroll-time-left">
              {t('page-with-text.buttons.web.auto-scroll-time', { mins: Math.ceil(minsLeft) })}
            </div>
          )}

          <div className="auto-scroll-speed-section">
            <div className="auto-scroll-speed-label">{t('page-with-text.buttons.web.auto-scroll-speed')}</div>
            <div className="auto-scroll-speed-controls">
              <Tip textKey="auto-scroll-slower">
                <Button icon circular onClick={speedDown} disabled={wpm <= MIN_WPM}>
                  <span className="material-symbols-outlined">remove</span>
                </Button>
              </Tip>
              <input
                className="auto-scroll-speed-value"
                type="number"
                min={MIN_WPM}
                max={MAX_WPM}
                value={wpmInput}
                onChange={e => setWpmInput(e.target.value)}
                onBlur={e => commitWpm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && commitWpm(e.target.value)}
              />
              <Tip textKey="auto-scroll-faster">
                <Button icon circular onClick={speedUp} disabled={wpm >= MAX_WPM}>
                  <span className="material-symbols-outlined">add</span>
                </Button>
              </Tip>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default AutoScrollBtn;
