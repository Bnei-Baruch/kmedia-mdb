import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';
import { Icon } from 'semantic-ui-react';

class AVMuteUnmute extends Component {

  static propTypes = {
    media: PropTypes.shape({
      isMuted: PropTypes.bool.isRequired,
      volume: PropTypes.number.isRequired,
      muteUnmute: PropTypes.func.isRequired,
    }).isRequired,
    upward: PropTypes.bool,
  };

  static defaultProps = {
    upward: true,
  }

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
      bottom: this.props.upward ? 17 : -118,
      background: 'black',
      opacity: 0.65,
      visibility: volumeHover || wasMouseDown ? 'visible' : 'hidden',
    };

    const bar = {
      display: 'flex',
      flexDirection: 'column-reverse',
      flexWrap: 'nowrap',
      paddingLeft: 10,
      paddingRight: 10,
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
          style={{}}
        >
          {isMuted &&
          <Icon key="mute" name="volume off"
                style={{margin: 0, height: '100%' }} />
          }
          {volume > 0 && volume < 0.5 &&
          <Icon key="volume-down" name="volume down"
                style={{margin: 0, height: '100%' }} />
          }
          {volume >= 0.5 &&
          <Icon key="volume-up" name="volume up"
                style={{margin: 0, height: '100%' }} />
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
