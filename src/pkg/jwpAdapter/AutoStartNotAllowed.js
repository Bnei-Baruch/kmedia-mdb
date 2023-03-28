import { useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import { selectors as player } from '../../redux/modules/player';
import { selectors as playlist } from '../../redux/modules/playlist';
import { play, setMute } from './adapter';
import { noop } from 'lodash';

const AutoStartNotAllowed = () => {
  const isReady           = useSelector(state => player.isReady(state.player));
  const { isSingleMedia } = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);

  //mute and play on autostartNotAllowed
  useEffect(() => {
    if (!isReady || !isSingleMedia) return noop;
    const jwp         = window.jwplayer();
    const muteAndPlay = () => {
      setMute(true);
      play();
    };
    jwp.once('autostartNotAllowed', muteAndPlay);
    return () => jwp.off('autostartNotAllowed', muteAndPlay);
  }, [isReady, isSingleMedia]);

  return null;
};

export default AutoStartNotAllowed;
