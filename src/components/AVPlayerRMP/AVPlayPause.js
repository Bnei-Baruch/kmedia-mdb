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
      playPause: PropTypes.func.isRequired,
    }).isRequired,
    showNextPrev: PropTypes.bool,
    hasNext: PropTypes.bool,
    hasPrev: PropTypes.bool,
    onNext: PropTypes.func,
    onPrev: PropTypes.func,
  };

  shouldComponentUpdate(prevProps) {
    const { media, hasNext, hasPrev, showNextPrev } = prevProps;
    return this.props.media.isPlaying !== media.isPlaying ||
      this.props.hasNext !== hasNext ||
      this.props.hasPrev !== hasPrev ||
      this.props.showNextPrev !== showNextPrev;
  }

  handlePlayPause = () => {
    this.props.media.playPause();
  };

  render() {
    const { media, showNextPrev, hasNext, hasPrev, onNext, onPrev } = this.props;

    console.log(hasPrev, hasNext);

    return (
      <div style={{display: 'flex', flexDirection: 'row',
                   marginLeft: '10px', marginRight: '5px'}}>
        { showNextPrev ? (
        <button
          type="button"
          tabIndex="-1"
          disabled={!hasPrev}
          className={classNames('player-button')}
          onClick={onPrev}
          style={{ marginRight: '5px' }}
        >
          <Icon
            name={'step backward'}
            disabled={!hasPrev}
            style={{margin: 0, height: '100%' }}
          />
        </button>) : null }
        <button
          type="button"
          tabIndex="-1"
          className={classNames('player-button')}
          onClick={this.handlePlayPause}
        >
          <Icon
            name={media.isPlaying ? 'pause' : 'play'}
            style={{margin: 0, height: '100%' }}
          />
        </button>
        { showNextPrev ? (
        <button
          type="button"
          tabIndex="-1"
          disabled={!hasNext}
          className={classNames('player-button')}
          onClick={onNext}
          style={{ marginLeft: '5px' }}
        >
          <Icon
            name={'step forward'}
            disabled={!hasNext}
            style={{margin: 0, height: '100%' }}
          />
        </button>) : null }
      </div>
    );
  }
}

export default withMediaProps(AVPlayPause);
