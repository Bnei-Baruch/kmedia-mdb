import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TimedPopup from '../shared/TimedPopup';

const AVAudioVideo = (props) => {
  const { isAudio, setAudio, isVideo, setVideo, t, fallbackMedia } = props;

  const popup = !fallbackMedia ? null : (
    <TimedPopup
      openOnInit
      message={isAudio ? t('messages.fallback-to-audio') : t('messages.fallback-to-video')}
      downward={isAudio}
      timeout={7000}
    />
  );

  return (
    <div className={classNames('player-button player-control-audio-video')}>
      { popup }
      <div
        style={{ textDecoration: isAudio ? 'underline' : 'none' }}
        role="button"
        tabIndex="0"
        onClick={setAudio}
      >
        {t('buttons.audio')}
      </div>
      <span>&nbsp;/&nbsp;</span>
      <div
        style={{ textDecoration: isVideo ? 'underline' : 'none' }}
        role="button"
        tabIndex="0"
        onClick={setVideo}
      >
        {t('buttons.video')}
      </div>
    </div>
  );
};

AVAudioVideo.propTypes = {
  isAudio: PropTypes.bool.isRequired,
  setAudio: PropTypes.func.isRequired,
  isVideo: PropTypes.bool.isRequired,
  setVideo: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fallbackMedia: PropTypes.bool.isRequired,
};

export default AVAudioVideo;
