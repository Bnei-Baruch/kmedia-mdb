import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withMediaProps } from 'react-media-player';
import { Icon } from 'semantic-ui-react';

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
        tabIndex="-1"
        className={classNames('player-button')}
        onClick={this.handlePlayPause}
        style={{ marginLeft: '10px', marginRight: '5px' }}
      >
        <Icon
          name={media.isPlaying ? 'pause' : 'play'}
          style={{margin: 0, height: '100%' }}
        />
      </button>
    );
  }
}

export default withMediaProps(AVPlayPause);
