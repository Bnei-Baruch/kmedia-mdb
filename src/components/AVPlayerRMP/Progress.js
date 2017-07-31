import React, { Component } from 'react';

import { withMediaProps } from 'react-media-player';

class Progress extends Component {
  _element = null;
  _wasMouseDown = false;
  _isPlayingOnMouseDown = false;
  _onChangeUsed = false;

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('touchmove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('touchend', this.handleMouseUp);
  }

  handleMouseDown = (e) => {
    this._wasMouseDown = true;
    this._isPlayingOnMouseDown = this.props.media.isPlaying;
    this.props.media.pause();
  }

  handleMouseMove = (e) => {
    // Resolve clientX from mouse or touch event.
    const clientX = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
    if (this._wasMouseDown) {
      this.seek(clientX);
    }
  }

  handleMouseUp = (e) => {
    if (this._wasMouseDown) {
      this._wasMouseDown = false;

      // only play if media was playing prior to mouseDown
      if (this._isPlayingOnMouseDown) {
        this.props.media.play();
      }
    }
  }

  seek = (clientX) => {
    const { left, right } = this._element.getBoundingClientRect();
    const { duration } = this.props.media;
    const offset = Math.min(Math.max(0, clientX - left), right - left);
    this.props.media.seekTo(duration * offset / (right - left));
  }

  render() {
    const { currentTime, duration } = this.props.media;
    const current = currentTime / duration;
    // Overriding progress of native react-media-player as he does not works correctly
    // with buffers.
    const { buffers } = this.props;
    const b = buffers.find(b => b.start <= currentTime && b.end >= currentTime);
    const progress = b && (b.end / duration) || (currentTime / duration);

    const normalize = l => {
      const ret = 100 * l;
      if (ret < 1) {
        return 0;
      }
      return ret;
    }

    const parent = {
      display: 'flex',
      flexWrap: 'nowrap',
      paddingTop: 5,
      paddingBottom: 5,
      marginLeft: 10,
      marginRight: 10,
    };
    const styleBar = {
      height: 3,
      marginLeft: 0,
      marginRight: 0,
    };
    const stylePlayed = {
      width: normalize(current),
      backgroundColor: 'rgb(66, 133, 244)',
      ...styleBar,
      position: 'relative',
    };
    const styleLoaded = {
      width: normalize(progress - current),
      backgroundColor: 'rgb(214, 214, 214)',
      ...styleBar,
    };
    const styleLeft = {
      width: normalize(1 - progress),
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
    return (<div ref={c => this._element = c}
                 style={parent}
                 onMouseDown={this.handleMouseDown}
                 onTouchStart={this.handleMouseDown}>
              <div style={stylePlayed}>
                <div style={knobStyle}></div>
              </div>
              <div style={styleLoaded}></div>
              <div style={styleLeft}></div>
            </div>);
  }
}

export default withMediaProps(Progress);
