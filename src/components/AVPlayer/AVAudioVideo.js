import React from 'react';
import PropTypes from 'prop-types';
import TimedPopup from '../shared/TimedPopup';

const AVAudioVideo = (props) => {
  const { isAudio, isVideo, onSwitch, t, fallbackMedia } = props;

  const popup = !fallbackMedia ? null : (
    <TimedPopup
      openOnInit
      message={isAudio ? t('messages.fallback-to-audio') : t('messages.fallback-to-video')}
      downward={isAudio}
      timeout={7000}
    />
  );

  return (
    <div className="mediaplayer__audiovideo">
      {popup}
      <button onClick={onSwitch}>
        <span className={isAudio ? 'is-active' : ''}>{t('buttons.audio')}</span>
        &nbsp;/&nbsp;
        <span className={isVideo ? 'is-active' : ''}>{t('buttons.video')}</span>
      </button>
    </div>
  );
};

AVAudioVideo.propTypes = {
  isAudio: PropTypes.bool.isRequired,
  isVideo: PropTypes.bool.isRequired,
  onSwitch: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fallbackMedia: PropTypes.bool.isRequired,
};

export default AVAudioVideo;
