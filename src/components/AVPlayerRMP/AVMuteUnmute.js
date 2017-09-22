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
      volumeHover: false,
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

  handleMouseEnter = (e) => {
    this.setState({ volumeHover: true });
  };

  handleMouseLeave = (e) => {
    this.setState({ volumeHover: false });
  };

  // Handle volume change on bar
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
    this.setState({ wasMouseDown: true });
  };

  handleMove = (e) => {
    if (this.state.wasMouseDown) {
      // Resolve clientY from mouse or touch event.
      const clientY = e.touches ? e.touches[e.touches.length - 1].clientY : e.clientY;
      this.setVolume(clientY);
      e.preventDefault();
    }
  };

  handleEnd = (e) => {
    if (this.state.wasMouseDown) {
      this.setState({ wasMouseDown: false, volumeHover: false });
      // Seek on desktop on mouse up. On mobile Move is called so no need to setVolume here.
      if (e.clientY) {
        this.setVolume(e.clientY);
      }
      e.preventDefault();
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

    const volumePopoverStyle = {
      position: 'absolute',
      bottom: this.props.upward ? '100%' : 'auto',
      top: this.props.upward ? 'auto' : '100%',
      background: 'black',
      opacity: 0.65,
      visibility: volumeHover || wasMouseDown ? 'visible' : 'hidden',
    };

    const styleVolume = {
      height: this.normalize(volume) + 'px',
    };

    const styleBlank = {
      height: this.normalize(1 - volume) + 'px',
    };

    return (
      <div className="player-control-mute-unmute">
        <button
          type="button"
          className="player-button"
          onClick={this.handleMuteUnmute}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          style={{}}
        >
          {
            isMuted && (
              <Icon
                key="mute"
                name="volume off"
                style={{ margin: 0, height: '100%' }}
              />
            )
          }
          {
            volume > 0 && volume < 0.5 && (
              <Icon
                key="volume-down"
                name="volume down"
                style={{ margin: 0, height: '100%' }}
              />
            )
          }
          {
            volume >= 0.5 && (
              <Icon
                key="volume-up"
                name="volume up"
                style={{ margin: 0, height: '100%' }}
              />
            )
          }
        </button>
        <div
          className="volume-popover"
          style={volumePopoverStyle}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <div
            ref={c => this.element = c}
            className="bar-wrapper"
            onMouseDown={this.handleStart}
            onTouchStart={this.handleStart}
          >
            <div className="bar volume" style={styleVolume}>
              <div className="knob" />
            </div>
            <div className="bar blank" style={styleBlank} />
          </div>
        </div>
      </div>
    );
  }
}

export default withMediaProps(AVMuteUnmute);
