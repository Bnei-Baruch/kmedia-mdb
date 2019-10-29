import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';
import { Icon } from 'semantic-ui-react';

const AVMuteUnmute = ({ upward = true, media, media: { isMuted, volume }, isAudio }, onVolumeChange, onMuteUnmute) => {
  const [element, setElement]           = useState(null);
  const [volumeHover, setVolumeHover]   = useState(false);
  const [wasMouseDown, setWasMouseDown] = useState(false);

  // Handle volume change on bar
  useEffect(() => {
    document.addEventListener('mousemove', handleMove, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleEnd, { passive: false });
    document.addEventListener('touchend', handleEnd, { passive: false });
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
  });

  const setVolume = (clientY) => {
    const { top, bottom } = element.getBoundingClientRect();
    const offset          = Math.min(Math.max(0, clientY - top), bottom - top);
    const newVolume       = 1 - (offset / (bottom - top));
    media.setVolume(newVolume);
    onVolumeChange();
  };

  const handleMuteUnmute = () => {
    media.muteUnmute();
    onMuteUnmute();
  };

  const handleMouseEnter = () => {
    setVolumeHover(true);
  };

  const handleMouseLeave = () => {
    setVolumeHover(false);
  };

  const handleStart = () => {
    setWasMouseDown(true);
  };

  const handleMove = (e) => {
    if (wasMouseDown) {
      // Resolve clientY from mouse or touch event.
      const clientY = e.touches ? e.touches[e.touches.length - 1].clientY : e.clientY;
      setVolume(clientY);
      e.preventDefault();
    }
  };

  const handleEnd = (e) => {
    if (wasMouseDown) {
      setWasMouseDown(false);
      setVolumeHover(false);
      // Seek on desktop on mouse up. On mobile Move is called so no need to setVolume here.
      if (e.clientY) {
        setVolume(e.clientY);
      }
      e.preventDefault();
    }
  };

  const normalize = (l) => {
    const ret = 100 * l;
    if (ret < 1) {
      return 0;
    }
    return ret;
  };

  const volumePopoverStyle = {
    bottom: upward ? '100%' : 'auto',
    top: upward ? 'auto' : '100%',
    visibility: volumeHover || wasMouseDown ? 'visible' : 'hidden',
  };

  const styleFull = {
    height: `${normalize(volume)}px`,
  };

  const styleEmpty = {
    height: `${normalize(1 - volume)}px`,
  };

  return (
    <div className="mediaplayer__volume">
      <button
        type="button"
        onClick={handleMuteUnmute}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {
          isMuted && (
            <Icon key="mute" name="volume off" />
          )
        }
        {
          volume > 0 && volume < 0.5 && (
            <Icon key="volume-down" name="volume down" />
          )
        }
        {
          volume >= 0.5 && (
            <Icon key="volume-up" name="volume up" />
          )
        }
      </button>
      <div
        className={isAudio ? 'volume-popover volume-popover__audio' : 'volume-popover'}
        style={volumePopoverStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={c => setElement(c)}
          className="volume-popover__wrapper"
          role="button"
          tabIndex="0"
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        >
          <div className="volume-popover__bar is-full" style={styleFull}>
            <div className="volume-popover__knob" />
          </div>
          <div className="volume-popover__bar is-empty" style={styleEmpty} />
        </div>
      </div>
    </div>
  );
};

AVMuteUnmute.propTypes = {
  media: PropTypes.shape({
    isMuted: PropTypes.bool.isRequired,
    volume: PropTypes.number.isRequired,
    muteUnmute: PropTypes.func.isRequired,
    setVolume: PropTypes.func.isRequired,
  }).isRequired,
  upward: PropTypes.bool,
  isAudio: PropTypes.bool.isRequired,
  onMuteUnmute: PropTypes.func.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
};

export default withMediaProps(AVMuteUnmute);
