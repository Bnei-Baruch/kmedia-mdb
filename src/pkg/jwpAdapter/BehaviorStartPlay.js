import React, { useEffect, useRef, useMemo, useContext } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { selectors as player, actions } from '../../redux/modules/player';
import { MY_NAMESPACE_HISTORY } from '../../helpers/consts';
import { useLocation } from 'react-router-dom';
import { startEndFromQuery } from '../../components/Player/Controls/helper';
import { getSavedTime, findPlayedFile } from '../../components/Player/helper';
import { selectors as playlist } from '../../redux/modules/playlist';
import { selectors as my } from '../../redux/modules/my';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { LOCALSTORAGE_MUTE } from './adapter';

const BehaviorStartPlay = () => {
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const isReady            = useSelector(state => player.isReady(state.player));
  const isMuted            = useSelector(state => player.isMuted(state.player));

  const item = useSelector(state => playlist.getPlayed(state.playlist), shallowEqual);
  const info = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);
  const file = useMemo(() => findPlayedFile(item, info), [item, info]);

  const { cuId, isSingleMedia } = info;

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
  }, [isMuted, isSingleMedia, isMobileDevice]);

  //start from saved time on load or switch playlist item
  useEffect(() => {
    if (!isReady || start || end !== Infinity || !fetched || file.id === fileIdRef.current) return;

    const jwp       = window.jwplayer();
    const autostart = !!fileIdRef.current || isSingleMedia;

    const { current_time: seek } = getSavedTime(cuId, historyItem);
    jwp.setConfig({ autostart });

    if (!isNaN(seek) && seek > 0 && (seek + 10 < file.duration)) {
      jwp.seek(seek)[autostart ? 'play' : 'pause']();
    } else if (!autostart) {
      jwp.pause();
      dispatch(actions.setLoaded(true));
    } else {
      jwp.play();
    }
    fileIdRef.current = file.id;
  }, [isReady, start, end, cuId, file, historyItem, fileIdRef.current, isSingleMedia, fetched]);

  return null;
};

export default BehaviorStartPlay;
