import { useEffect, useRef } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { selectors as player, actions } from '../../redux/modules/player';
import { MY_NAMESPACE_HISTORY } from '../../helpers/consts';
import { useLocation } from 'react-router-dom';
import { startEndFromQuery } from '../../components/Player/Controls/helper';
import { getSavedTime } from '../../components/Player/helper';
import { selectors as playlist } from '../../redux/modules/playlist';
import { selectors as my } from '../../redux/modules/my';
import { seek, play, setMute, pause } from './adapter';
import { noop } from 'lodash';

const BehaviorStartPlay = () => {
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

  const isReady = useSelector(state => player.isReady(state.player));

  const { duration, id: fileId } = useSelector(state => player.getFile(state.player)) || {};

  const { id: fileIdHls, isHLS } = useSelector(state => playlist.getPlayed(state.playlist));
  const { cuId, isSingleMedia }  = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);

  const historyItem = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY)?.find(x => x.content_unit_uid === cuId));
  const { fetched } = useSelector(state => my.getInfo(state.my, MY_NAMESPACE_HISTORY), shallowEqual);

  const fileIdRef = useRef();
  const dispatch  = useDispatch();

  //mute and play on autostartNotAllowed
  useEffect(() => {
    if (!isReady || !isSingleMedia) return noop;
    const jwp            = window.jwplayer();
    const activeteJwpHls = () => {
      setMute(true);
      play();
    };
    jwp.once('autostartNotAllowed', activeteJwpHls);
    return () => jwp.off('autostartNotAllowed', activeteJwpHls);
  }, [isReady, isSingleMedia]);

  //start from saved time on load or switch playlist item
  const isClip  = start || end !== Infinity;
  const _fileId = isHLS ? fileIdHls : fileId;
  useEffect(() => {
    if (!isReady || isClip || !fetched || _fileId === fileIdRef.current) return;

    const autostart = !!fileIdRef.current || isSingleMedia;

    const { current_time: offset } = getSavedTime(cuId, historyItem);
    console.log('loading bug: BehaviorStartPlay effect', offset);
    if (!isNaN(offset) && offset > 0 && (offset + 10 < duration)) {
      seek(offset);
    }
    if (autostart) {
      play();
    } else {
      pause();
      dispatch(actions.setLoaded(true));
    }
    fileIdRef.current = _fileId;
  }, [isReady, isClip, cuId, _fileId, duration, historyItem, fileIdRef, isSingleMedia, fetched, dispatch]);

  return null;
};

export default BehaviorStartPlay;
