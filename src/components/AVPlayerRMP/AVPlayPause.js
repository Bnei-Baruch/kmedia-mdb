import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withMediaProps } from 'react-media-player';

class AVPlayPause extends Component {
  static PropTypes = {
    media: PropTypes.shape({
      isPlaying: PropTypes.bool.isRequired,
      playPause: PropTypes.func.isRequired
    }).isRequired,
  };

  static defaultProps = {
  };

  shouldComponentUpdate({ media }) {
    return this.props.media.isPlaying !== media.isPlaying;
  }

  _handlePlayPause = () => {
    this.props.media.playPause();
  };

  render() {
    const { className, style, media } = this.props;
    return (
      <button
        type="button"
        className={className}
        style={style}
        onClick={this._handlePlayPause}
      >
        { media.isPlaying ? 'Pause!' : 'Play!' }
      </button>
    );
  }
}

export default withMediaProps(AVPlayPause);
