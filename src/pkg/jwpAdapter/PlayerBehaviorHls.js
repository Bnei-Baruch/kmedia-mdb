import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors as playlist, selectors as playlistSelectors } from '../../redux/modules/playlist';

const PlayerBehaviorHls = () => {
  const { quality, language }    = useSelector(state => playlist.getInfo(state.playlist));
  const { languages, qualities } = useSelector(state => playlistSelectors.getPlayed(state.playlist));

  useEffect(() => {
    if (!languages) return;

    const idx = languages.findIndex(l => l === language);
    window.jwplayer().setCurrentAudioTrack(idx);
  }, [language, languages]);

  useEffect(() => {
    if (!qualities) return;

    const idx = qualities.findIndex(q => q === quality);
    window.jwplayer().setCurrentQuality(idx);
  }, [quality, qualities]);

  return null;
};

export default PlayerBehaviorHls;
