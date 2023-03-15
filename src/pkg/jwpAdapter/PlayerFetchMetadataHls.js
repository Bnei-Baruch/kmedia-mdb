import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectors as player } from '../../redux/modules/player';
import { actions, selectors as playlist } from '../../redux/modules/playlist';

const PlayerBehaviorHls = () => {
  const isMetadataReady = useSelector(state => player.isMetadataReady(state.player));
  const isReady         = useSelector(state => player.isReady(state.player));
  const { mediaType }   = useSelector(state => playlist.getInfo(state.playlist));

  const dispatch = useDispatch();

  //insert file id to HLS playlist item
  useEffect(() => {
    if (!isReady) return;
    dispatch(actions.updatePlayed({}));
  }, [isReady, mediaType, dispatch]);

  useEffect(() => {
    if (!isMetadataReady) return;

    const jwp             = window.jwplayer();
    const languages       = jwp.getAudioTracks().map(t => t.language);
    const video_qualities = jwp.getQualityLevels().map(t => t.label);

    dispatch(actions.updatePlayed({ video_qualities, languages }));
    const qIdx = jwp.getCurrentQuality();
    dispatch(actions.setQuality(video_qualities[qIdx]));
  }, [isMetadataReady, dispatch]);

  return null;
};

export default PlayerBehaviorHls;
