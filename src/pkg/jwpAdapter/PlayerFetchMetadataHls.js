import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectors as player } from '../../redux/modules/player';
import { actions } from '../../redux/modules/playlist';
import { isPlayerReady } from './adapter';
import { noop } from '../../helpers/utils';

const PlayerBehaviorHls = () => {
  const isReady = useSelector(state => player.isReady(state.player));

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isReady || !isPlayerReady()) return noop;
    const onMetadata = () => {
      const jwp       = window.jwplayer();
      const languages = jwp.getAudioTracks().map(t => t.language);
      const qualities = jwp.getQualityLevels().map(t => t.label);
      dispatch(actions.updatePlayed({ qualities, languages }));
      jwp.off('metadataCueParsed', onMetadata);
    };

    window.jwplayer().on('metadataCueParsed', onMetadata);

    return () => {
      window.jwplayer().off('metadataCueParsed', onMetadata);
    };

  }, [isReady, dispatch]);

  return null;
};

export default PlayerBehaviorHls;
