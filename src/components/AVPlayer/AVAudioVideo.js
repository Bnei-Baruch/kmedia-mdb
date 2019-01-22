import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import TimedPopup from '../shared/TimedPopup';

class AVAudioVideo extends Component {
  static propTypes = {
    isAudio: PropTypes.bool.isRequired,
    isVideo: PropTypes.bool.isRequired,
    onSwitch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    fallbackMedia: PropTypes.bool.isRequired,
  };

  handleSwitch = () => {
    const { onSwitch } = this.props;
    onSwitch();
  };

  handleBtnRef = (ref) => {
    if (ref) {
      this.mainBtn = ref;
      this.mainBtn.addEventListener('click', this.handleSwitch);
    } else if (this.mainBtn) {
      this.mainBtn.removeEventListener('click', this.handleSwitch);
      this.mainBtn = ref;
    }
  };

  render() {
    const { isAudio, isVideo, t, fallbackMedia } = this.props;

    const popup = !fallbackMedia ? null : (
      <TimedPopup
        openOnInit
        message={isAudio ? t('messages.fallback-to-audio') : t('messages.fallback-to-video')}
        downward={false}
        timeout={7000}
      />
    );

    return (
      <div className="mediaplayer__audiovideo">
        {popup}
        <button ref={this.handleBtnRef} type="button">
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <span className={isAudio ? 'is-active' : ''}>{t('buttons.audio')}</span>
          &nbsp;/&nbsp;
          <span className={isVideo ? 'is-active' : ''}>{t('buttons.video')}</span>
        </button>
      </div>
    );
  }
}

export default withNamespaces()(AVAudioVideo);
