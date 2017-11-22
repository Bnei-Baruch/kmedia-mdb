import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withMediaProps } from 'react-media-player';
import { Icon } from 'semantic-ui-react';



class AVCenteredPlay extends Component {
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

    if (media.isPlaying) {
      return <div />;
    }

    return (
      <button
        type="button"
        tabIndex="-1"
        className={classNames('mediaplayer__onscreen-play')}
        onClick={this.handlePlayPause}
      >
        <Icon
          name={'video play'}
          size="massive"
        />
      </button>
    );
  }
}

export default withMediaProps(AVCenteredPlay);
