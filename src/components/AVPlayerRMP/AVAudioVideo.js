import React from 'react';
import PropTypes from 'prop-types';

const AVAudioVideo = (props) => {
  const { isAudio, setAudio, isVideo, setVideo, t } = props;

  return (
    <div style={{ display: 'flex' }}>
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
};

export default AVAudioVideo;
