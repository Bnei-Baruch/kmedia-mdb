import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';
import fullscreenImage from './images/fullscreen.svg';
import exitFullscreenImage from './images/exit_fullscreen.svg';

class AVFullscreen extends Component {
  static propTypes = {
    media: PropTypes.shape({
      isFullscreen: PropTypes.bool.isRequired,
      fullscreen: PropTypes.func.isRequired
    }).isRequired,
  };

  shouldComponentUpdate({ media }) {
    return this.props.media.isFullscreen !== media.isFullscreen;
  }

  handleFullscreen = () => {
    this.props.media.fullscreen();
  }

  render() {
    const { media } = this.props;
    return (
      <button
        type="button"
        className="player-button"
        onClick={this.handleFullscreen}
        style={{ width: '16px', height: '16px', marginLeft: 10, marginRight: 10 }}
      >
        <img
          src={media.isFullScreen ? exitFullscreenImage : fullscreenImage}
          alt={media.isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        />
      </button>
    );
  }
}

export default withMediaProps(AVFullscreen);
