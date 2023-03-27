import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../redux/modules/playlist';
import { selectors as player } from '../../redux/modules/player';
import { noop } from 'lodash';
import { seek } from './adapter';

const PlayerBehaviorHls = () => {
  const isMetadataReady = useSelector(state => player.isMetadataReady(state.player));
  const isReady         = useSelector(state => player.isReady(state.player));

  const { quality, language } = useSelector(state => playlist.getInfo(state.playlist));

  //patch of get metadata from HLS need start fetch it before any user activity
  useEffect(() => {
    if (!isReady) return noop;
    const jwp            = window.jwplayer();
    const activeteJwpHls = () => seek(0);
    jwp.once('autostartNotAllowed', activeteJwpHls);
    return () => jwp.off('autostartNotAllowed', activeteJwpHls);
  }, [isReady]);

  useEffect(() => {
    if (!isMetadataReady) return;
    const jwp    = window.jwplayer();
    const tracks = jwp.getAudioTracks();

    if (!tracks) return;
    const idx = tracks.findIndex(q => q.language === language);
    jwp.setCurrentAudioTrack(idx);
  }, [language, isMetadataReady]);

  useEffect(() => {
    if (!isMetadataReady) return;
    const jwp    = window.jwplayer();
    const levels = jwp.getQualityLevels();
    if (!levels) return;

    const idx = levels.findIndex(q => q.label === quality);
    jwp.setCurrentQuality(idx);
  }, [quality, isMetadataReady]);

  return null;
};

export default PlayerBehaviorHls;
