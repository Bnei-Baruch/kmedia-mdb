import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as player, actions } from '../../lib/redux/slices/playerSlice/playerSlice';

const AutoStartNotAllowed = () => {
  const isReady = useSelector(state => player.isReady(state.player));

  const dispatch = useDispatch();
  useEffect(() => {
    if (!isReady) return;
    const jwp       = window.jwplayer();
    const setLoaded = () => dispatch(actions.setLoaded(true));
    if (jwp.once) {
      jwp.once('autostartNotAllowed', setLoaded);
      jwp.once('playAttemptFailed', setLoaded);
    }
  }, [isReady, dispatch]);

  return null;
};

export default AutoStartNotAllowed;
