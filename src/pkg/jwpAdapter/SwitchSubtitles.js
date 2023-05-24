import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectors as player } from '../../redux/modules/player';
import { selectors as playlist } from '../../redux/modules/playlist';

const SwitchSubtitles = () => {
  const isReady      = useSelector(state => player.isReady(state.player));
  const subsLanguage = useSelector(state => playlist.getInfo(state.playlist).subsLanguage);

  useEffect(() => {
    if (!isReady) return;
    const jwp = window.jwplayer();
    const idx = jwp.getCaptionsList()?.findIndex(c => c.language === subsLanguage);

    jwp.setCurrentCaptions(Math.max(idx, 0));
  }, [isReady, subsLanguage]);

  return null;
};

export default SwitchSubtitles;
