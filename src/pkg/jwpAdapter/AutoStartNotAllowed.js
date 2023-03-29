import { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { selectors as player, actions } from '../../redux/modules/player';
import { selectors as playlist } from '../../redux/modules/playlist';
import { play, setMute } from './adapter';
import { noop } from 'lodash/util';

const AutoStartNotAllowed = () => {
  const isReady           = useSelector(state => player.isReady(state.player));
  const { isSingleMedia } = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);

  const dispatch = useDispatch();
  //mute and play on autostartNotAllowed
  useEffect(() => {
    if (!isReady) return noop;
    const jwp         = window.jwplayer();
    const muteAndPlay = () => {
      if (isSingleMedia) {
        setMute(true);
        play();
      } else {
        dispatch(actions.setLoaded(true));
        play();
      }
    };
    jwp.once('autostartNotAllowed', muteAndPlay);
    return () => jwp.off('autostartNotAllowed', muteAndPlay);
  }, [isReady, isSingleMedia, dispatch]);

  return null;
};

export default AutoStartNotAllowed;
