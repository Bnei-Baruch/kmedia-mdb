import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimedPopup from '../shared/TimedPopup';

class AVAudioVideo extends Component {
  static propTypes = {
    isAudio: PropTypes.bool.isRequired,
    isVideo: PropTypes.bool.isRequired,
    onSwitch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    fallbackMedia: PropTypes.bool.isRequired,
    uiLanguage: PropTypes.string,
  };

  state = {};

  handleSwitch = () =>
    this.props.onSwitch();

  handleBtnRef = (ref) => {
    if (ref) {
      this.mainBtn = ref;
      this.mainBtn.addEventListener('click', this.handleSwitch);
    } else if (this.mainBtn) {
      this.mainBtn.removeEventListener('click', this.handleSwitch);
      this.mainBtn = ref;
    }
  };

  setAudioVideoContainerRef = (audioVideoContainerRef) => this.setState({ audioVideoContainerRef });

  render() {
    const { isAudio, isVideo, t, fallbackMedia, uiLanguage } = this.props;
    const { audioVideoContainerRef }                         = this.state;
    const openPopup                                          = !!fallbackMedia;

    return (
      <div ref={this.setAudioVideoContainerRef} className="mediaplayer__audiovideo">
        <TimedPopup
          openOnInit={openPopup}
          message={isAudio ? t('messages.fallback-to-audio') : t('messages.fallback-to-video')}
          downward={false}
          timeout={7000}
          language={uiLanguage}
          refElement={audioVideoContainerRef}
        />
        <button ref={this.handleBtnRef}>
          <span className={isAudio ? 'is-active' : ''}>{t('buttons.audio')}</span>
          &nbsp;/&nbsp;
          <span className={isVideo ? 'is-active' : ''}>{t('buttons.video')}</span>
        </button>
      </div>
    );
  }
}

export default AVAudioVideo;
