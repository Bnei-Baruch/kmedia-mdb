import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actions } from '../../redux/modules/player';
import { playerIsReadySelector } from '../../redux/selectors';

const AutoStartNotAllowed = () => {
  const isReady = useSelector(playerIsReadySelector);

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
