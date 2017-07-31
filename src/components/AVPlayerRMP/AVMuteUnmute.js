import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';
import volumeMuteImage from './images/volume_mute.svg';
import volumeLowImage from './images/volume_low.svg';
import volumeMediumImage from './images/volume_medium.svg';
import volumeHighImage from './images/volume_high.svg';

class AVMuteUnmute extends Component {

  static propTypes = {
    media: PropTypes.shape({
      isMute: PropTypes.bool.isRequired,
      volume: PropTypes.number.isRequired,
      muteUnmute: PropTypes.func.isRequired
    }).isRequired
  };

  handleMuteUnmute = () => {
    this.props.media.muteUnmute();
  }

  render() {
    const { media: { isMuted, volume } } = this.props;

    return (
      <button
        type="button"
        className="player-button"
        onClick={this.handleMuteUnmute}
        style={{ width: '16px', height: '16px' }}
      >
        { isMuted &&
          <img key="mute" src={volumeMuteImage} alt="muted" />
        }
        { volume > 0 && volume < 0.3 &&
          <img key="low-volume" src={volumeLowImage} alt="low volume" />
        }
        { volume > 0.3 && volume < 0.6 &&
          <img key="medium-volume" src={volumeMediumImage} alt="medium volume" />
        }
        { volume >= 0.6 &&
          <img key="high-volume" src={volumeHighImage} alt="high volume" />
        }
      </button>
    );
  }
}

export default withMediaProps(AVMuteUnmute);
