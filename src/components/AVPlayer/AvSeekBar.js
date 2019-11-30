import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isNumber from 'lodash/isNumber';
import { withMediaProps } from 'react-media-player';

import { PLAYER_MODE } from './constants';
import { playerModeProp } from '../shapes';

class AvSeekBar extends Component {
  static propTypes = {
    media: PropTypes.object.isRequired, // TODO: (yaniv) use right propType
    buffers: PropTypes.array,
    playerMode: playerModeProp.isRequired,
    sliceStart: PropTypes.number,
    sliceEnd: PropTypes.number,
  };

  static defaultProps = {
    buffers: [],
    sliceStart: 0,
    sliceEnd: Infinity,
  };

  state = {
    seekbarHadInteraction: false,
    playPoint: this.props.media.currentTime
  };

  element = null;

  wasMouseDown = false;

  isPlayingOnMouseDown = false;

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMove, { passive: false });
    document.addEventListener('touchmove', this.handleMove, { passive: false });
    document.addEventListener('mouseup', this.handleEnd, { passive: false });
    document.addEventListener('touchend', this.handleEnd, { passive: false });
  }

  componentDidUpdate(prevProps) {
    if (this.props.media.currentTime !== prevProps.media.currentTime) {
      this.setState({ playPoint: this.props.media.currentTime });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('touchmove', this.handleMove);
    document.removeEventListener('mouseup', this.handleEnd);
    document.removeEventListener('touchend', this.handleEnd);
  }

  getSeekPositionFromClientX = (clientX) => {
    const { media }       = this.props;
    const { left, right } = this.element.getBoundingClientRect();
    const { duration }    = media;
    const offset          = Math.min(Math.max(0, clientX - left), right - left);

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
  };

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

    if (!this.state.seekbarHadInteraction) {
      this.setState({ seekbarHadInteraction: true });
    }
  };

  handleMove = (e) => {
    const { media } = this.props;
    if (this.wasMouseDown) {
      e.preventDefault();
      // Resolve clientX from mouse or touch event.
      const clientX      = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
      this.touchClientX  = clientX; // this is stored for touch because touchend has no coords
      const seekPosition = this.getSeekPositionFromClientX(clientX);
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
        const seekPosition = this.getSeekPositionFromClientX(clientX);
        media.seekTo(seekPosition);
        this.setState({ playPoint: seekPosition });
      }

      this.touchClientX = undefined;
    }
  };

  render() {
    const { currentTime, duration } = this.props.media;
    const current                   = this.state.playPoint / duration;
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

    const styleLoaded = {
      left: 0,
      width: this.toPercentage(progress),
    };

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
                  left: this.toPercentage(normalizedSliceStart),
                  width: this.toPercentage(normalizedSliceEnd - normalizedSliceStart)
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
