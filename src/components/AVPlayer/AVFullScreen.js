import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fscreen from 'fscreen';
import { Icon } from 'semantic-ui-react';

class AVFullscreen extends Component {
  static propTypes = {
    element: PropTypes.object,
  };

  static defaultProps = {
    element: null,
  };

  state = {
    fullScreen: false,
  };

  componentDidMount() {
    fscreen.addEventListener('fullscreenchange', this.fullScreenChange);
  }

  componentWillUnmount() {
    fscreen.removeEventListener('fullscreenchange', this.fullScreenChange);
  }

  fullScreenChange = () => {
    this.setState({ fullScreen: this.isFullScreenElement() });
  };

  isFullScreenElement = () => fscreen.fullscreenElement !== null;

  handleFullscreen = () => {
    if (this.isFullScreenElement()) {
      fscreen.exitFullscreen();
    } else {
      fscreen.requestFullscreen(this.props.element);
    }
  };

  render() {
    const { element }    = this.props;
    const { fullScreen } = this.state;
    return (
      <button
        type="button"
        className="player-button player-control-fullscreen"
        disabled={!element || !fscreen.fullscreenEnabled}
        onClick={this.handleFullscreen}
      >
        <Icon name={fullScreen ? 'compress' : 'expand'} />
      </button>
    );
  }
}

export default AVFullscreen;
