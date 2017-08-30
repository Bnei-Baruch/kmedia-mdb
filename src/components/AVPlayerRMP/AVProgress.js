import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';
import classNames from 'classnames';

class AVProgress extends Component {

  static propTypes = {
    media: PropTypes.object.isRequired, // TODO: (yaniv) use right propType
    buffers: PropTypes.array,
    isSlice: PropTypes.bool,
    sliceStart: PropTypes.number,
    sliceEnd: PropTypes.number
  };

  static defaultProps = {
    buffers: [],
    isSlice: false,
    sliceStart: 0,
    sliceEnd: Infinity
  };

  _element              = null;
  _wasMouseDown         = false;
  _isPlayingOnMouseDown = false;

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMove);
    document.addEventListener('touchmove', this.handleMove);
    document.addEventListener('mouseup', this.handleEnd);
    document.addEventListener('touchend', this.handleEnd);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('touchmove', this.handleMove);
    document.removeEventListener('mouseup', this.handleEnd);
    document.removeEventListener('touchend', this.handleEnd);
  }

  handleStart = (e) => {
    this._wasMouseDown         = true;
    this._isPlayingOnMouseDown = this.props.media.isPlaying;

    this.props.media.pause();
  };

  handleMove = (e) => {
    if (this._wasMouseDown) {
      // Resolve clientX from mouse or touch event.
      const clientX = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
      this.seek(clientX);
    }
  };

  handleEnd = (e) => {
    if (this._wasMouseDown) {
      this._wasMouseDown = false;
      // Seek on desktop on mouse up. On mobile Move is called so no need to seek here.
      if (e.clientX) {
        this.seek(e.clientX);
      }

      // only play if media was playing prior to mouseDown
      if (this._isPlayingOnMouseDown) {
        this.props.media.play();
      }
    }
  };

  seek = (clientX) => {
    const { left, right } = this._element.getBoundingClientRect();
    const { duration }    = this.props.media;
    const offset          = Math.min(Math.max(0, clientX - left), right - left);
    this.props.media.seekTo(duration * offset / (right - left));
  };

  normalize = (l) => {
    const ret = 100 * l;
    return (ret < 1) ? 0 : ret + '%';
  };

  render() {
    const { currentTime, duration } = this.props.media;
    const current                   = currentTime / duration;
    // Overriding progress of native react-media-player as he does not works correctly
    // with buffers.
    const { buffers } = this.props;
    const b           = buffers.find(b => b.start <= currentTime && b.end >= currentTime);
    const progress    = (b && (b.end / duration)) || current;

    const stylePlayed = {
      width: this.normalize(current),
    };

    const styleLoaded = {
      width: this.normalize(progress),
      left: 0
    };

    const styleRemaining = {
      width: this.normalize(1 - progress),
      left: this.normalize(progress)
    };

    return (
      <div
        ref={c => this._element = c}
        className="player-button player-control-progress"
        onMouseDown={this.handleStart}
        onTouchStart={this.handleStart}
      >
        <div className="bar played" style={stylePlayed}>
          <div className="knob" />
        </div>
        <div className="bar loaded" style={styleLoaded} />
        <div className="bar remaining" style={styleRemaining} />
      </div>
    );
  }
}

export default withMediaProps(AVProgress);
