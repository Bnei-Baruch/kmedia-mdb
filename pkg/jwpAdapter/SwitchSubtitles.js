import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectors as player } from '../../lib/redux/slices/playerSlice/playerSlice';
import { selectors as playlist } from '../../lib/redux/slices/playlistSlice/playlistSlice';

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
