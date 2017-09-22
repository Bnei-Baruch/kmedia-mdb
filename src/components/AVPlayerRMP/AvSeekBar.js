import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isNumber from 'lodash/isNumber';
import noop from 'lodash/noop';
import { withMediaProps } from 'react-media-player';
import classNames from 'classnames';
import { PLAYER_MODE } from './constants';
import { playerModeProp } from './propTypes';

class AvSeekBar extends Component {

  static propTypes = {
    media: PropTypes.object.isRequired, // TODO: (yaniv) use right propType
    buffers: PropTypes.array,
    playerMode: playerModeProp.isRequired,
    sliceStart: PropTypes.number,
    sliceEnd: PropTypes.number,
    onSliceStartChange: PropTypes.func,
    onSliceEndChange: PropTypes.func,
    isMobile: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    buffers: [],
    sliceStart: 0,
    sliceEnd: Infinity,
    onSliceStartChange: noop,
    onSliceEndChange: noop
  };

  element              = null;
  wasMouseDown         = false;
  isPlayingOnMouseDown = false;

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMove, { passive: false });
    document.addEventListener('touchmove', this.handleMove, { passive: false });
    document.addEventListener('mouseup', this.handleEnd, { passive: false });
    document.addEventListener('touchend', this.handleEnd, { passive: false });
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('touchmove', this.handleMove);
    document.removeEventListener('mouseup', this.handleEnd);
    document.removeEventListener('touchend', this.handleEnd);
  }

  handleStart = (e) => {
    this.wasMouseDown         = true;
    this.isPlayingOnMouseDown = this.props.media.isPlaying;

    this.props.media.pause();

    if (e.target.classList.contains('slice-start')) {
      this.sliceStartActive = true;
    } else if (e.target.classList.contains('slice-end')) {
      this.sliceEndActive = true;
    } else {
      this.sliceStartActive = false;
      this.sliceEndActive = false;
    }
  };

  handleMove = (e) => {
    const { playerMode, onSliceStartChange, onSliceEndChange, sliceStart, sliceEnd } = this.props;
    if (this.wasMouseDown) {
      // Resolve clientX from mouse or touch event.
      const clientX = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
      const seekPosition = this.getSeekPositionFromClientX(clientX);

      if (playerMode === PLAYER_MODE.SLICE_EDIT) {
        if (this.sliceStartActive) {
          if (seekPosition < sliceEnd) {
            onSliceStartChange(seekPosition);
          }
        } else if (this.sliceEndActive) {
          if (seekPosition > sliceStart) {
            onSliceEndChange(seekPosition);
          }
        }
      } else {
        this.seek(seekPosition);
      }
      e.preventDefault();
    }
  };

  handleEnd = (e) => {
    const { playerMode, media } = this.props;
    if (this.wasMouseDown) {
      this.wasMouseDown = false;

      if (e.clientX) {
        const seekPosition = this.getSeekPositionFromClientX(e.clientX);
        // Seek on desktop on mouse up. On mobile Move is called so no need to seek here.
        if (playerMode === PLAYER_MODE.NORMAL || playerMode === PLAYER_MODE.SLICE_VIEW) {
          this.seek(seekPosition);
        // Correct current time if position is out of bounds of edited slice
        } else if (playerMode === PLAYER_MODE.SLICE_EDIT) {
          if (
            (this.sliceStartActive === true && seekPosition > media.currentTime)
            || (this.sliceEndActive === true && seekPosition < media.currentTime)
          ) {
            this.seek(seekPosition);
          }
        }
      }

      this.sliceStartActive = false;
      this.sliceEndActive = false;

      // only play if media was playing prior to mouseDown
      if (this.isPlayingOnMouseDown) {
        this.props.media.play();
      }
      e.preventDefault();
    }
  };

  getSeekPositionFromClientX = (clientX) => {
    const { media } = this.props;
    const { left, right } = this.element.getBoundingClientRect();
    const { duration }    = media;
    const offset          = Math.min(Math.max(0, clientX - left), right - left);

    return (duration * offset) / (right - left);
  }

  clampPositionInSlice = (position, sliceStart, sliceEnd) => {
    let clampedPosition = position;
    if (position > sliceEnd) {
      clampedPosition = sliceEnd;
    } else if (position < sliceStart) {
      clampedPosition = sliceStart;
    }

    return clampedPosition;
  }

  seek = (seekPosition) => {
    const { media, playerMode, sliceStart, sliceEnd } = this.props;
    let correctedSeekPosition;

    if (playerMode === PLAYER_MODE.SLICE_EDIT || playerMode === PLAYER_MODE.SLICE_VIEW) {
      correctedSeekPosition = this.clampPositionInSlice(seekPosition, sliceStart, sliceEnd);
      media.seekTo(!correctedSeekPosition || correctedSeekPosition === Infinity ? media.duration : correctedSeekPosition);
    }

    media.seekTo(seekPosition);
  };

  toPercentage = (l) => {
    const ret = 100 * l;
    if (ret > 100) {
      return '100%';
    }
    return (ret < 1) ? 0 : `${ret}%`;
  };

  getNormalizedSliceStart = (duration) => {
    const { sliceEnd } = this.props;
    let { sliceStart } = this.props;
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
  }

  getNormalizedSliceEnd = (duration) => {
    const { sliceStart } = this.props;
    let { sliceEnd } = this.props;

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
  }

  render() {
    const { isMobile } = this.props;
    const { currentTime, duration } = this.props.media;
    const current                   = currentTime / duration;
    // Overriding progress of native react-media-player as he does not works correctly
    // with buffers.
    const { buffers, playerMode } = this.props;
    const buf         = buffers.find(b => b.start <= currentTime && b.end >= currentTime);
    const progress    = (buf && (buf.end / duration)) || current;

    const isSlice = playerMode === PLAYER_MODE.SLICE_EDIT || playerMode === PLAYER_MODE.SLICE_VIEW;
    const isSliceEdit = playerMode === PLAYER_MODE.SLICE_EDIT;
    const normalizedSliceStart = this.getNormalizedSliceStart(duration);
    const normalizedSliceEnd = this.getNormalizedSliceEnd(duration);

    const stylePlayed = {
      width: this.toPercentage(current - normalizedSliceStart),
      left: isSlice ? this.toPercentage(normalizedSliceStart) : 0
    };

    const styleLoaded = {
      width: this.toPercentage(isSlice ? (Math.min(progress, normalizedSliceEnd) - normalizedSliceStart) : progress),
      left: isSlice ? this.toPercentage(normalizedSliceStart) : 0
    };

    const styleRemaining = {
      width: this.toPercentage(1 - progress),
      left: this.toPercentage(progress)
    };

    const styleSlice = {
      left: this.toPercentage(normalizedSliceStart),
      width: this.toPercentage(normalizedSliceEnd - normalizedSliceStart)
    };

    return (
      <div
        ref={(c) => { this.element = c; }}
        className={
          classNames('player-button player-control-seekbar', {
            mobile: isMobile,
            'player-control-seekbar-slice': isSlice,
            'player-control-seekbar-slice-edit': isSliceEdit
          }
        )}
        onMouseDown={this.handleStart}
        onTouchStart={this.handleStart}
      >
        <div className="bar played" style={stylePlayed}>
          <div className={classNames('knob', { mobile: isMobile })} />
        </div>
        <div className="bar loaded" style={styleLoaded} />
        <div className="bar remaining" style={styleRemaining} />
        {
          isSlice && (
            <div className="bar slice" style={styleSlice}>
              <div className="slice-start" />
              <div className="slice-end" />
            </div>
          )
        }
      </div>
    );
  }
}

export default withMediaProps(AvSeekBar);
