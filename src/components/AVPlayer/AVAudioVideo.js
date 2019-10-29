import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import TimedPopup from '../shared/TimedPopup';

const AVAudioVideo = ({ isAudio, isVideo, fallbackMedia, uiLanguage, onSwitch, t }) => {
  const [audioVideoContainerRef, setAudioVideoContainerRef]       = useState();
  const [didShowFallbackMediaPopup, setDidShowFallbackMediaPopup] = useState();
  const [openPopup, setOpenPopup]                                 = useState();

  const handleSwitch = useCallback(() => onSwitch(), [onSwitch]);

  const handleFallbackMedia = useCallback(fallbackMedia => {
    if (didShowFallbackMediaPopup) {
      setOpenPopup(false);
      return;
    }

    setOpenPopup(!!fallbackMedia);
    setDidShowFallbackMediaPopup(!!fallbackMedia);
  }, [didShowFallbackMediaPopup]);

  useEffect(() => {
    handleFallbackMedia(fallbackMedia);
  }, [fallbackMedia, handleFallbackMedia]);

  return (
    <div ref={setAudioVideoContainerRef} className="mediaplayer__audiovideo">
      <TimedPopup
        openOnInit={openPopup}
        message={isAudio ? t('messages.fallback-to-audio') : t('messages.fallback-to-video')}
        downward={false}
        timeout={7000}
        language={uiLanguage}
        refElement={audioVideoContainerRef}
      />
      <button type="button" onClick={handleSwitch}>
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
  uiLanguage: PropTypes.string.isRequired,
};

export default withNamespaces()(AVAudioVideo);
