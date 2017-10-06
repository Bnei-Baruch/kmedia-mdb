import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

class AVFullscreen extends Component {
  static propTypes = {
    container: PropTypes.instanceOf(Element),
  };

  static defaultProps = {
    container: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      fullScreen: false,
    };
  }

  componentDidMount() {
    document.addEventListener('fullscreenchange', this.fullScreenChange);
  }

  componentWillUnmount() {
    document.removeEventListener('fullscreenchange', this.fullScreenChange);
  }

  fullScreenChange = () => {
    this.setState({ fullScreen: this.isFullScreenElement() });
  }

  launchIntoFullScreen = () => {
    const { container } = this.props;
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    }
  }

  exitFullScreen = () => {
    if (document.exitFullScreen) {
      document.exitFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  isFullScreenElement = () =>
      document.fullscreenElement || document.mozFullScreenElement ||
      document.webkitFullscreenElement || document.msFullscreenElement;

  handleFullscreen = () => {
    if (this.isFullScreenElement()) {
      this.exitFullScreen();
    } else {
      this.launchIntoFullScreen();
    }
  };

  render() {
    const { container } = this.props;
    const { fullScreen } = this.state;
    return (
      <button
        disabled={!container}
        type="button"
        className="player-button player-control-fullscreen"
        onClick={this.handleFullscreen}
      >
        <Icon name={fullScreen ? 'compress' : 'expand'} />
      </button>
    );
  }
}

export default AVFullscreen;
