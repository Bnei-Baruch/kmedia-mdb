import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as player } from '../../redux/modules/player';
import { selectors as playlist } from '../../redux/modules/playlist';

const SwitchSubtitles = () => {
  const isReady     = useSelector(state => player.isReady(state.player));
  const subsLanguage = useSelector(state => playlist.getInfo(state.playlist).subsLanguage);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isReady) return;
    const jwp = window.jwplayer();
    const idx = jwp.getCaptionsList().find(c => c.language === subsLanguage) || 0;

    jwp.setCurrentCaptions(idx);
  }, [isReady, subsLanguage]);

  return null;
};

export default SwitchSubtitles;
