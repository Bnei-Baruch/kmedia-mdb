import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as player, actions } from '../../redux/modules/player';

const AutoStartNotAllowed = () => {
  const isReady = useSelector(state => player.isReady(state.player));

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isReady) return;
    const jwp         = window.jwplayer();
    const muteAndPlay = () => dispatch(actions.setLoaded(true));
    jwp.once && jwp.once('autostartNotAllowed', muteAndPlay);
  }, [isReady, dispatch]);

  return null;
};

export default AutoStartNotAllowed;
