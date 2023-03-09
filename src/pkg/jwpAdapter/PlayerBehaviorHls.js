import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../redux/modules/playlist';

const PlayerBehaviorHls = () => {
  const { quality, language } = useSelector(state => playlist.getInfo(state.playlist));

  useEffect(() => {
    const jwp    = window.jwplayer();
    const tracks = jwp.getAudioTracks();
    if (!tracks) return;

    const idx = tracks.findIndex(q => q.language === language);
    jwp.setCurrentAudioTrack(idx);
  }, [language]);

  useEffect(() => {
    const jwp    = window.jwplayer();
    const levels = jwp.getQualityLevels();
    if (!levels) return;

    const idx = levels.findIndex(q => q.label === quality);
    jwp.setCurrentQuality(idx);
  }, [quality]);

  return null;
};

export default PlayerBehaviorHls;
