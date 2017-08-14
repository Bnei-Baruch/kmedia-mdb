import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';

import volumeMuteImage from './images/volume_mute.svg';
import volumeLowImage from './images/volume_low.svg';
import volumeMediumImage from './images/volume_medium.svg';
import volumeHighImage from './images/volume_high.svg';

class AVMuteUnmute extends Component {

  static propTypes = {
    media: PropTypes.shape({
      isMuted: PropTypes.bool.isRequired,
      volume: PropTypes.number.isRequired,
      muteUnmute: PropTypes.func.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);

    this.element = null;
    this.state   = {
      volumeHover: 0,
      wasMouseDown: false,
    };
  }

  setVolume = (clientY) => {
    const { top, bottom } = this.element.getBoundingClientRect();
    const offset          = Math.min(Math.max(0, clientY - top), bottom - top);
    const newVolume       = 1 - offset / (bottom - top);
    this.props.media.setVolume(newVolume);
  };

  handleMuteUnmute = () => {
    this.props.media.muteUnmute();
  };

  handleMouseEnter = () => {
    this.setState({ volumeHover: 1 });
  };

  handleMouseLeave = () => {
    this.setState({ volumeHover: 0 });
  };

  // Handle volume change on bar
  componentDidMount() {
    this.element.addEventListener('mousemove', this.handleMove);
    this.element.addEventListener('touchmove', this.handleMove);
    this.element.addEventListener('mouseup', this.handleEnd);
    this.element.addEventListener('touchend', this.handleEnd);
  }

  componentWillUnmount() {
    this.element.removeEventListener('mousemove', this.handleMove);
    this.element.removeEventListener('touchmove', this.handleMove);
    this.element.removeEventListener('mouseup', this.handleEnd);
    this.element.removeEventListener('touchend', this.handleEnd);
  }

  handleStart = (e) => {
    this.setState({ wasMouseDown: true });
  };

  handleMove = (e) => {
    if (this.state.wasMouseDown) {
      // Resolve clientY from mouse or touch event.
      const clientY = e.touches ? e.touches[e.touches.length - 1].clientY : e.clientY;
      this.setVolume(clientY);
    }
  };

  handleEnd = (e) => {
    if (this.state.wasMouseDown) {
      this.setState({ wasMouseDown: false });
      // Seek on desktop on mouse up. On mobile Move is called so no need to setVolume here.
      if (e.clientY) {
        this.setVolume(e.clientY);
      }
    }
  };

  normalize = l => {
    const ret = 100 * l;
    if (ret < 1) {
      return 0;
    }
    return ret;
  };

  render() {
    const { media: { isMuted, volume } } = this.props;
    const { volumeHover, wasMouseDown }  = this.state;

    // TODO: (yaniv) preload images?
    const parentStyle = {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column-reverse',
    };

    const volumeStyle = {
      position: 'absolute',
      bottom: 17,
      background: 'black',
      opacity: 0.65,
      visibility: volumeHover || wasMouseDown ? 'visible' : 'hidden',
    };

    const bar = {
      display: 'flex',
      flexDirection: 'column-reverse',
      flexWrap: 'nowrap',
      paddingLeft: 8,
      paddingRight: 8,
      marginBottom: 10,
      marginTop: 10,
    };

    const styleBar = {
      width: 3,
      marginTop: 0,
      marginBottom: 0,
    };

    const styleVolume = {
      height: this.normalize(volume) + 'px',
      backgroundColor: 'rgb(66, 133, 244)',
      ...styleBar,
      position: 'relative',
    };

    const styleBlank = {
      height: this.normalize(1 - volume) + 'px',
      backgroundColor: 'rgb(118, 118, 118)',
      ...styleBar,
    };

    const knobStyle = {
      position: 'absolute',
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: 'rgb(66, 133, 244)',
      right: -3,
      top: -5,
    };

    return (
      <div style={parentStyle}>
        <button
          type="button"
          className="player-button"
          onClick={this.handleMuteUnmute}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          style={{ width: '16px', height: '16px' }}
        >
          {isMuted &&
          <img key="mute" src={volumeMuteImage} alt="muted" />
          }
          {volume > 0 && volume < 0.3 &&
          <img key="low-volume" src={volumeLowImage} alt="low volume" />
          }
          {volume > 0.3 && volume < 0.6 &&
          <img key="medium-volume" src={volumeMediumImage} alt="medium volume" />
          }
          {volume >= 0.6 &&
          <img key="high-volume" src={volumeHighImage} alt="high volume" />
          }
        </button>
        <div style={volumeStyle}
             onMouseEnter={this.handleMouseEnter}
             onMouseLeave={this.handleMouseLeave}>
          <div
            ref={c => this.element = c}
            style={bar}
            onMouseDown={this.handleStart}
            onTouchStart={this.handleStart}
          >
            <div style={styleVolume}>
              <div style={knobStyle} />
            </div>
            <div style={styleBlank} />
          </div>
        </div>
      </div>
    );
  }
}

export default withMediaProps(AVMuteUnmute);
