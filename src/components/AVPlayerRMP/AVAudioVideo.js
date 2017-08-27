import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const AVAudioVideo = (props) => {
  const { isAudio, setAudio, isVideo, setVideo, t } = props;

  return (
    <div className="player-button player-control-audio-video">
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
