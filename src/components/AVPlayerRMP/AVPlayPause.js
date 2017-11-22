import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withMediaProps } from 'react-media-player';
import { Icon } from 'semantic-ui-react';



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

  static defaultProps = {
    showNextPrev: null,
    hasNext: null,
    hasPrev: null,
    onNext: null,
    onPrev: null,
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

    return (
      <div className='buttons-wrapper'>
        { showNextPrev ? (
          <button
            type="button"
            tabIndex="-1"
            disabled={!hasPrev}
            onClick={onPrev}
          >
            <Icon
              name={'step backward'}
              disabled={!hasPrev}
            />
          </button>
        ) : null }
        <button
          type="button"
          tabIndex="-1"
          onClick={this.handlePlayPause}
        >
          <Icon name={media.isPlaying ? 'pause' : 'play'} />
        </button>
        { showNextPrev ? (
          <button
            type="button"
            tabIndex="-1"
            disabled={!hasNext}
            onClick={onNext}
          >
            <Icon name={'step forward'} disabled={!hasNext} />
          </button>
        ) : null }
      </div>
    );
  }
}

export default withMediaProps(AVPlayPause);
