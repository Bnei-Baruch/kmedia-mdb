import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { playlistGetInfoSelector, playerIsReadySelector } from '../../redux/selectors';

const SwitchSubtitles = () => {
  const isReady          = useSelector(playerIsReadySelector);
  const { subsLanguage } = useSelector(playlistGetInfoSelector);

  useEffect(() => {
    if (!isReady) return;
    const jwp = window.jwplayer();
    const idx = jwp.getCaptionsList()?.findIndex(c => c.language === subsLanguage);

    jwp.setCurrentCaptions(Math.max(idx, 0));
  }, [isReady, subsLanguage]);

  return null;
};

export default SwitchSubtitles;
