import React, { Component } from 'react';
import { withMediaProps } from 'react-media-player';

class AVProgress extends Component {
  _element = null;
  _wasMouseDown = false;
  _isPlayingOnMouseDown = false;

  componentDidMount() {
    this._element.addEventListener('mousemove', this.handleMove);
    this._element.addEventListener('touchmove', this.handleMove);
    this._element.addEventListener('mouseup', this.handleEnd);
    this._element.addEventListener('touchend', this.handleEnd);
  }

  componentWillUnmount() {
    this._element.removeEventListener('mousemove', this.handleMove);
    this._element.removeEventListener('touchmove', this.handleMove);
    this._element.removeEventListener('mouseup', this.handleEnd);
    this._element.removeEventListener('touchend', this.handleEnd);
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
    const progress    = (b && (b.end / duration)) || (currentTime / duration);

    const parent = {
      display: 'flex',
      flexWrap: 'nowrap',
      paddingTop: 5,
      paddingBottom: 5,
      marginLeft: 10,
      marginRight: 10,
      width: '100%',
    };

    const styleBar = {
      height: 3,
      marginLeft: 0,
      marginRight: 0,
    };

    const stylePlayed = {
      width: this.normalize(current),
      backgroundColor: 'rgb(66, 133, 244)',
      ...styleBar,
      position: 'relative',
    };

    const styleLoaded = {
      width: this.normalize(progress - current),
      backgroundColor: 'rgb(214, 214, 214)',
      ...styleBar,
    };

    const styleLeft = {
      width: this.normalize(1 - progress),
      backgroundColor: 'rgb(118, 118, 118)',
      ...styleBar,
    };

    const knobStyle = {
      position: 'absolute',
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: 'rgb(66, 133, 244)',
      right: -5,
      top: -3,
    };

    return (
      <div
        ref={c => this._element = c}
        style={parent}
        onMouseDown={this.handleStart}
        onTouchStart={this.handleStart}>
        <div style={stylePlayed}>
          <div style={knobStyle} />
        </div>
        <div style={styleLoaded} />
        <div style={styleLeft} />
      </div>
    );
  }
}

export default withMediaProps(AVProgress);
