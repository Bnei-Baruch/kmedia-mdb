import { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { selectors as player, actions } from '../../redux/modules/player';
import { selectors as playlist } from '../../redux/modules/playlist';
import { noop } from 'lodash/util';

const AutoStartNotAllowed = () => {
  const isReady           = useSelector(state => player.isReady(state.player));
  const { isSingleMedia } = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);

  const dispatch = useDispatch();
  //mute and play on autostartNotAllowed
  useEffect(() => {
    if (!isReady) return noop;
    const jwp         = window.jwplayer();
    const muteAndPlay = () => dispatch(actions.setLoaded(true));
    jwp.once('autostartNotAllowed', muteAndPlay);
    return () => jwp.off('autostartNotAllowed', muteAndPlay);
  }, [isReady, dispatch]);

  return null;
};

export default AutoStartNotAllowed;
