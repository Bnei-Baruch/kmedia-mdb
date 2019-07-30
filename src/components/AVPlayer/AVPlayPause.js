import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';
import { Icon } from 'semantic-ui-react';

class AVPlayPause extends Component {
  static propTypes = {
    media: PropTypes.shape({
      isPlaying: PropTypes.bool,
      isLoading: PropTypes.bool,
      playPause: PropTypes.func,
    }).isRequired,
    showNextPrev: PropTypes.bool,
    hasNext: PropTypes.bool,
    hasPrev: PropTypes.bool,
    onNext: PropTypes.func,
    onPrev: PropTypes.func,
    withoutPlay: PropTypes.bool,
  };

  static defaultProps = {
    showNextPrev: null,
    hasNext: null,
    hasPrev: null,
    onNext: null,
    onPrev: null,
    withoutPlay: false,
  };

  shouldComponentUpdate(prevProps) {
    const { media, hasNext, hasPrev, showNextPrev } = prevProps;
    return this.props.media.isPlaying !== media.isPlaying
      || this.props.hasNext !== hasNext
      || this.props.hasPrev !== hasPrev
      || this.props.showNextPrev !== showNextPrev;
  }

  handlePlayPause = () => {
    if (!this.props.media.isLoading) {
      this.props.media.playPause();
    }
  };

  handleMainBtnRef = (ref) => {
    if (ref) {
      this.mainBtn = ref;
      this.mainBtn.addEventListener('click', this.handlePlayPause);
    } else if (this.mainBtn) {
      this.mainBtn.removeEventListener('click', this.handlePlayPause);
      this.mainBtn = ref;
    }
  };

  render() {
    const { media, showNextPrev, hasNext, hasPrev, onNext, onPrev, withoutPlay } = this.props;

    return (
      <div className="buttons-wrapper">
        {
          showNextPrev ? (
            <button
              type="button"
              tabIndex="-1"
              disabled={!hasPrev}
              onClick={onPrev}
            >
              <Icon name="step backward" disabled={!hasPrev} />
            </button>
          ) : null
        }
        {
          withoutPlay
            ? null
            : (
              <button
                ref={this.handleMainBtnRef}
                type="button"
                tabIndex="-1"
              >
                <Icon name={media.isPlaying ? 'pause' : 'play'} />
              </button>
            )}
        {
          showNextPrev ? (
            <button
              type="button"
              tabIndex="-1"
              disabled={!hasNext}
              onClick={onNext}
            >
              <Icon name="step forward" disabled={!hasNext} />
            </button>
          ) : null
        }
      </div>
    );
  }
}

export default withMediaProps(AVPlayPause);
