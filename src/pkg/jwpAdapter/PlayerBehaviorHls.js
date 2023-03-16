import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../redux/modules/playlist';
import { selectors as player } from '../../redux/modules/player';

const PlayerBehaviorHls = () => {

  const isMetadataReady       = useSelector(state => player.isMetadataReady(state.player));
  const { quality, language } = useSelector(state => playlist.getInfo(state.playlist));

  useEffect(() => {
    if (!isMetadataReady) return;
    const jwp    = window.jwplayer();
    const tracks = jwp.getAudioTracks();

    if (!tracks) return;
    const idx = tracks.findIndex(q => q.language === language);
    jwp.setCurrentAudioTrack(idx);
  }, [language, isMetadataReady]);

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
