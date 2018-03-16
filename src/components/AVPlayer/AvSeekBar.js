import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isNumber from 'lodash/isNumber';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { withMediaProps } from 'react-media-player';

import { formatTime } from '../../helpers/time';
import { PLAYER_MODE } from './constants';
import { playerModeProp } from './propTypes';
import SliceHandle from './SliceHandle';

const stickyHandleDelta = 5; // pixel width from which to stick to handle
const minSliceAreaWidth = 0.01;

class AvSeekBar extends Component {
  static propTypes = {
    media: PropTypes.object.isRequired, // TODO: (yaniv) use right propType
    buffers: PropTypes.array,
    playerMode: playerModeProp.isRequired,
    sliceStart: PropTypes.number,
    sliceEnd: PropTypes.number,
    onSliceStartChange: PropTypes.func,
    onSliceEndChange: PropTypes.func,
  };

  static defaultProps = {
    buffers: [],
    sliceStart: 0,
    sliceEnd: Infinity,
    onSliceStartChange: noop,
    onSliceEndChange: noop
  };

  state = {
    seekbarHadInteraction: false,
    playPoint: this.props.media.currentTime
  };

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMove, { passive: false });
    document.addEventListener('touchmove', this.handleMove, { passive: false });
    document.addEventListener('mouseup', this.handleEnd, { passive: false });
    document.addEventListener('touchend', this.handleEnd, { passive: false });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.sliceStartActive && !this.sliceEndActive && this.props.media.currentTime !== nextProps.media.currentTime) {
      this.setState({ playPoint: nextProps.media.currentTime });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('touchmove', this.handleMove);
    document.removeEventListener('mouseup', this.handleEnd);
    document.removeEventListener('touchend', this.handleEnd);
  }

  getSeekPositionFromClientX = (clientX) => {
    const { media, playerMode, sliceStart, sliceEnd } = this.props;
    const { left, right }                             = this.element.getBoundingClientRect();
    const { duration }                                = media;
    const offset                                      = Math.min(Math.max(0, clientX - left), right - left);

    if (playerMode === PLAYER_MODE.SLICE_EDIT) {
      // try stick to handle
      if (this.sliceStartHandle && this.sliceEndHandle) {
        const { left: startLeft } = this.sliceStartHandle.getHandleElement().getBoundingClientRect();
        const { left: endLeft }   = this.sliceEndHandle.getHandleElement().getBoundingClientRect();
        const sliceWidth          = endLeft - startLeft;
        // reduce delta if slice is small
        const fittedStickyDelta   = stickyHandleDelta * 2.5 > sliceWidth ? sliceWidth / 4 : stickyHandleDelta;
        if (Math.abs(clientX - startLeft) < fittedStickyDelta) {
          return sliceStart;
        }

        if (Math.abs(clientX - endLeft) < fittedStickyDelta) {
          return sliceEnd > duration ? duration : sliceEnd;
        }
      }
    }

    return (duration * offset) / (right - left);
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
  };

  getNormalizedSliceEnd = (duration) => {
    const { sliceStart } = this.props;
    let { sliceEnd }     = this.props;

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

  element              = null;
  wasMouseDown         = false;
  isPlayingOnMouseDown = false;

  toPercentage = (l) => {
    const ret = 100 * l;
    if (ret > 100) {
      return '100%';
    }
    return (ret < 1) ? 0 : `${ret}%`;
  };

  handleStart = (e) => {
    // regard only left mouse button click (0). touch is undefined
    if (e.button) {
      e.preventDefault();
      return;
    }

    this.wasMouseDown         = true;
    this.isPlayingOnMouseDown = this.props.media.isPlaying;

    if (this.sliceStartHandle && e.target === this.sliceStartHandle.getKnobElement()) {
      this.sliceStartActive = true;
    } else if (this.sliceEndHandle && e.target === this.sliceEndHandle.getKnobElement()) {
      this.sliceEndActive = true;
    } else {
      this.sliceStartActive = false;
      this.sliceEndActive   = false;
    }

    if (!this.state.seekbarHadInteraction) {
      this.setState({ seekbarHadInteraction: true });
    }
  };

  handleMove = (e) => {
    const { onSliceStartChange, onSliceEndChange, sliceStart, sliceEnd, media } = this.props;
    if (this.wasMouseDown) {
      e.preventDefault();
      // Resolve clientX from mouse or touch event.
      const clientX      = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
      this.touchClientX  = clientX; // this is stored for touch because touchend has no coords
      const seekPosition = this.getSeekPositionFromClientX(clientX);

      if (this.sliceStartActive) {
        if (seekPosition < sliceEnd) {
          onSliceStartChange(seekPosition);
        }
      } else if (this.sliceEndActive) {
        if (seekPosition > sliceStart) {
          onSliceEndChange(seekPosition);
        }
      }

      media.seekTo(seekPosition);
    }
  };

  handleEnd = (e) => {
    const { media } = this.props;
    if (this.wasMouseDown) {
      e.preventDefault();
      this.wasMouseDown = false;

      const clientX = e.clientX || this.touchClientX;

      if (typeof clientX !== 'undefined') {
        // pause when dragging handles

        const seekPosition = this.getSeekPositionFromClientX(clientX);
        media.seekTo(seekPosition);
        this.setState({ playPoint: seekPosition });
      }

      this.sliceStartActive = false;
      this.sliceEndActive   = false;
      this.touchClientX     = undefined;
    }
  };

  render() {
    const { sliceStart, sliceEnd } = this.props;
    const { currentTime, duration }          = this.props.media;
    const current                            = this.state.playPoint / duration;
    // Overriding progress of native react-media-player as he does not works correctly
    // with buffers.
    const { buffers, playerMode } = this.props;
    const buf                     = buffers.find(b => b.start <= currentTime && b.end >= currentTime);
    const progress                = (buf && (buf.end / duration));

    const isSliceEdit          = playerMode === PLAYER_MODE.SLICE_EDIT;
    const isSliceView          = playerMode === PLAYER_MODE.SLICE_VIEW;
    const isSlice              = isSliceEdit || isSliceView;
    const normalizedSliceStart = this.getNormalizedSliceStart(duration);
    const normalizedSliceEnd   = this.getNormalizedSliceEnd(duration);

    let playedLeft = 0;
    if (isSliceView && !this.state.seekbarHadInteraction) {
      playedLeft = normalizedSliceStart;
    }
    const playedWidth = Math.max(0, current - playedLeft);

    const stylePlayed = {
      left: this.toPercentage(playedLeft),
      width: this.toPercentage(playedWidth),
    };

    const stylePlayedKnob = {

      // left: this.toPercentage(playedLeft + playedWidth),

      // background: 'red'
    };

    const styleLoaded = {
      width: this.toPercentage(progress),
      left: 0
    };

    const sliceStartLeft = this.toPercentage(normalizedSliceStart);
    const sliceEndLeft   = this.toPercentage(normalizedSliceEnd);

    return (
      <div
        ref={(el) => {
          this.element = el;
        }}
        className="mediaplayer__seekbar"
        onMouseDown={this.handleStart}
        onTouchStart={this.handleStart}
        role="button"
        tabIndex="0"
      >

        <div className="seekbar">
          {
            isSliceEdit && (
              <SliceHandle
                ref={(el) => {
                  this.sliceStartHandle = el;
                }}
                seconds={formatTime(sliceStart)}
                position={sliceStartLeft}
                isEditMode={playerMode === PLAYER_MODE.SLICE_EDIT}
                className={classNames('seekbar__slicehandle--left', { 'seekbar__slicehandle--onstart': sliceStartLeft === 0 })}
              />
            )
          }
          {
            isSliceEdit && (
              <SliceHandle
                ref={(el) => {
                  this.sliceEndHandle = el;
                }}
                seconds={formatTime(sliceEnd === Infinity ? duration : sliceEnd)}
                position={sliceEndLeft}
                isEditMode={playerMode === PLAYER_MODE.SLICE_EDIT}
                className="seekbar__slicehandle--right"
              />
            )
          }

          <div className={classNames('seekbar__bar', 'is-empty')} />
          <div className={classNames('seekbar__bar', 'is-played')} style={stylePlayed}>
            <div className={classNames('seekbar__knob')} style={stylePlayedKnob} />
          </div>
          <div className={classNames('seekbar__bar', 'is-loaded')} style={styleLoaded} />
          {
            isSlice && (
              <div
                className={classNames('seekbar__bar', 'is-slice')}
                style={{
                  // left: sliceStartLeft === 0 ? 'calc('+sliceStartLeft+' + 7px)' : 'calc('+sliceStartLeft+' - 7px)',
                  left: sliceStartLeft,

                  width: this.toPercentage(Math.max(minSliceAreaWidth, normalizedSliceEnd - normalizedSliceStart))
                  // width: this.toPercentage(normalizedSliceEnd - normalizedSliceStart)

                }}
              />
            )
          }
        </div>
      </div>
    );
  }
}

export default withMediaProps(AvSeekBar);
