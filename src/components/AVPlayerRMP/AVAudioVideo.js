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
    <div className='mediaplayer__audiovideo'>
      { popup }
      <button onClick={setAudio}>
        <span className={ isAudio ? 'is-active' : '' }>{t('buttons.audio')}</span>
        &nbsp;/&nbsp;
        <span className={ isVideo ? 'is-active' : '' }>{t('buttons.video')}</span>
      </button>
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
