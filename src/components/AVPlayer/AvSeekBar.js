import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import isNumber from 'lodash/isNumber';
import { PLAYER_MODE } from './constants';
import { Media, playerModeProp } from '../shapes';

const toPercentage = l => {
  const ret = 100 * l;
  if (ret > 100) {
    return '100%';
  }

  return (ret < 1) ? 0 : `${ret}%`;
};

const AvSeekBar = ({ media, playerMode, buffers = [], sliceStart = 0, sliceEnd = Infinity }) => {
  const { currentTime, duration } = media;

  const [seekbarHadInteraction, setSeekbarHadInteraction] = useState(false);
  const [playPoint, setPlayPoint] = useState(currentTime);
  const [wasMouseDown, setWasMouseDown] = useState(false);
  const divElement = useRef();

  const getNormalizedSliceStart = duration => {
    if (!isNumber(sliceStart)) {
      return 0;
    }

    if (sliceStart > sliceEnd) {
      sliceStart = sliceEnd;
    }

    if (duration < sliceStart) {
      sliceStart = duration;
    }

    if (sliceStart < 0) {
      sliceStart = 0;
    }

    return sliceStart / duration;
  };

  const getNormalizedSliceEnd = duration => {
    if (!isNumber(sliceEnd)) {
      return 1;
    }

    if (sliceEnd < sliceStart) {
      sliceEnd = sliceStart;
    }

    if (sliceEnd > duration) {
      sliceEnd = duration;
    }

    if (sliceEnd < 0) {
      sliceEnd = 0;
    }

    return sliceEnd / duration;
  };

  const handleStart = e => {
    // regard only left mouse button click (0). touch is undefined
    if (e.button) {
      e.preventDefault();
      return;
    }

    setWasMouseDown(true);

    if (!seekbarHadInteraction) {
      setSeekbarHadInteraction(true);
    }
  };

  useEffect(() => {
    let touchClientX = null;

    const getSeekPositionFromClientX = clientX => {
      const { left, right } = divElement.current.getBoundingClientRect();
      const offset          = Math.min(Math.max(0, clientX - left), right - left);

      return (media.duration * offset) / (right - left);
    };

    const handleMove = e => {
      if (wasMouseDown) {
        e.preventDefault();
        // Resolve clientX from mouse or touch event.
        const clientX = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
        touchClientX = clientX; // this is stored for touch because touchend has no coords
        const seekPosition = getSeekPositionFromClientX(clientX);
        media.seekTo(seekPosition);
      }
    };

    const handleEnd = e => {
      if (wasMouseDown) {
        e.preventDefault();
        setWasMouseDown(false);

        const clientX = e.clientX || touchClientX;

        if (typeof clientX !== 'undefined') {
          const seekPosition = getSeekPositionFromClientX(clientX);
          media.seekTo(seekPosition);
          setPlayPoint(seekPosition);
        }

        touchClientX = undefined;
      }
    }

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
  }, [divElement, media, wasMouseDown]);

  useEffect(() => {
    setPlayPoint(currentTime);
  }, [currentTime]);


  // Overriding progress of native react-media-player as he does not works correctly
  // with buffers.
  const buf      = buffers.find(b => b.start <= currentTime && b.end >= currentTime);
  const progress = (buf && (buf.end / duration));

  const isSliceEdit          = playerMode === PLAYER_MODE.SLICE_EDIT;
  const isSliceView          = playerMode === PLAYER_MODE.SLICE_VIEW;
  const isSlice              = isSliceEdit || isSliceView;
  const normalizedSliceStart = getNormalizedSliceStart(duration);
  const normalizedSliceEnd   = getNormalizedSliceEnd(duration);

  const current = playPoint / duration;
  const playedLeft = isSliceView && !seekbarHadInteraction ? normalizedSliceStart : 0;
  const playedWidth = Math.max(0, current - playedLeft);

  const stylePlayed = {
    left: toPercentage(playedLeft),
    width: toPercentage(playedWidth),
  };

  const styleLoaded = {
    left: 0,
    width: toPercentage(progress),
  };

  return (
    <div
      ref={divElement}
      className="mediaplayer__seekbar"
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      role="button"
      tabIndex="0"
    >
      <div className="seekbar">
        <div className="seekbar__bar is-empty" />
        <div className="seekbar__bar is-played" style={stylePlayed}>
          <div className="seekbar__knob" />
        </div>
        <div className="seekbar__bar is-loaded" style={styleLoaded} />
        {
          isSlice && !(normalizedSliceStart === 0 && normalizedSliceEnd === 1) && (
            <div
              className="seekbar__bar is-slice"
              style={{
                left: toPercentage(normalizedSliceStart),
                width: toPercentage(normalizedSliceEnd - normalizedSliceStart)
              }}
            />
          )
        }
      </div>
    </div>
  );
}

AvSeekBar.propTypes = {
  media: Media.isRequired,
  buffers: PropTypes.array,
  playerMode: playerModeProp.isRequired,
  sliceStart: PropTypes.number,
  sliceEnd: PropTypes.number,
};

export default AvSeekBar;
