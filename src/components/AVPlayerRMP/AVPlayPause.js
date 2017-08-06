import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withMediaProps } from 'react-media-player';

import playImage from './images/play.svg';
import pauseImage from './images/pause.svg';
import './styles.css';

class AVPlayPause extends Component {
  static propTypes = {
    media: PropTypes.shape({
      isPlaying: PropTypes.bool.isRequired,
      playPause: PropTypes.func.isRequired
    }).isRequired,
  };

  shouldComponentUpdate({ media }) {
    return this.props.media.isPlaying !== media.isPlaying;
  }

  handlePlayPause = () => {
    this.props.media.playPause();
  };

  render() {
    const { media } = this.props;
    return (
      <button
        type="button"
        className={classNames('player-button')}
        onClick={this.handlePlayPause}
        style={{ width: '20px', height: '20px', marginLeft: '5px' }}
      >
        <img
          src={media.isPlaying ? pauseImage : playImage}
          alt={media.isPlaying ? 'pause' : 'play'}
        />
      </button>
    );
  }
}

export default withMediaProps(AVPlayPause);
