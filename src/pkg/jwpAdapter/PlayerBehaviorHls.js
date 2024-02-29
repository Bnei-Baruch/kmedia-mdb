import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VS_NAMES, LANGUAGES } from '../../helpers/consts';
import { playlistGetInfoSelector, playerIsMetadataReadySelector } from '../../redux/selectors';

const PlayerBehaviorHls = () => {
  const isMetadataReady = useSelector(playerIsMetadataReadySelector);

  const { quality, language } = useSelector(playlistGetInfoSelector);

  useEffect(() => {
    if (!isMetadataReady) return;
    const jwp    = window.jwplayer();
    const tracks = jwp.getAudioTracks();

    if (!tracks) return;
    //fix ukraine lang
    const lOpt = LANGUAGES[language];
    const l    = lOpt.hls || lOpt.value;
    const idx  = tracks.findIndex(q => q.language === l);
    jwp.setCurrentAudioTrack(idx);
  }, [language, isMetadataReady]);

  useEffect(() => {
    if (!isMetadataReady) return;
    const jwp    = window.jwplayer();
    const levels = jwp.getQualityLevels();
    if (!levels) return;
    const qN  = VS_NAMES[quality];
    const idx = levels.findIndex(q => q.label === qN);
    jwp.setCurrentQuality(idx);
  }, [quality, isMetadataReady]);

  return null;
};

export default PlayerBehaviorHls;
