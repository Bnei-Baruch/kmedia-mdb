import { useEffect, useRef, useContext } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { selectors as player, actions } from '../../redux/modules/player';
import { MY_NAMESPACE_HISTORY } from '../../helpers/consts';
import { useLocation } from 'react-router-dom';
import { startEndFromQuery } from '../../components/Player/Controls/helper';
import { getSavedTime } from '../../components/Player/helper';
import { selectors as playlist } from '../../redux/modules/playlist';
import { selectors as my } from '../../redux/modules/my';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { LOCALSTORAGE_MUTE, seek, play, pause } from './adapter';

const BehaviorStartPlay = () => {
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const isReady            = useSelector(state => player.isReady(state.player));
  const isMuted            = useSelector(state => player.isMuted(state.player));
  const { duration }       = useSelector(state => player.getFile(state.player)) || {};

  const { id: fileId }          = useSelector(state => playlist.getPlayed(state.playlist));
  const { cuId, isSingleMedia } = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);

  const historyItem = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY)?.find(x => x.content_unit_uid === cuId));
  const { fetched } = useSelector(state => my.getInfo(state.my, MY_NAMESPACE_HISTORY), shallowEqual);

  const fileIdRef = useRef();
  const dispatch  = useDispatch();

  //mute for autostart
  useEffect(() => {
    if (isMuted !== undefined) return;
    let mute = localStorage.getItem(LOCALSTORAGE_MUTE) === 'true';

    if (isSingleMedia && isMobileDevice) {
      mute = true;
      window.jwplayer().setConfig({ mute });
    }

    dispatch(actions.setIsMuted(mute));
  }, [isMuted, isSingleMedia, isMobileDevice, dispatch]);

  //start from saved time on load or switch playlist item
  const isClip = start || end !== Infinity;
  useEffect(() => {
    if (!isReady || isClip || !fetched || fileId === fileIdRef.current) return;

    const jwp       = window.jwplayer();
    const autostart = !!fileIdRef.current || isSingleMedia;

    const { current_time: offset } = getSavedTime(cuId, historyItem);
    jwp.setConfig({ autostart });
    if (!isNaN(offset) && offset > 0 && (offset + 10 < duration)) {
      seek(offset);
    }

    if (!autostart) {
      pause();
    } else {
      play();
    }

    dispatch(actions.setLoaded(true));
    fileIdRef.current = fileId;
  }, [isReady, isClip, cuId, fileId, duration, historyItem, fileIdRef, isSingleMedia, fetched, dispatch]);

  return null;
};

export default BehaviorStartPlay;
