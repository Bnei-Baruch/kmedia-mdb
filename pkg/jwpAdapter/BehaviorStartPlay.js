import { useEffect, useRef } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { selectors as player, actions } from '../../lib/redux/slices/playerSlice/playerSlice';
import { MY_NAMESPACE_HISTORY } from '../../src/helpers/consts';
import { getSavedTime } from '../../lib/player/helper';
import { selectors as playlist } from '../../lib/redux/slices/playlistSlice/playlistSlice';
import { selectors as my } from '../../lib/redux/slices/mySlice/mySlice';
import { seek, play, pause } from './adapter';
import { useSearchParams } from 'next/navigation';
import { startEndFromQuery } from '../../lib/player/Controls/helper';

const BehaviorStartPlay = () => {
  const query = useSearchParams();
  const { start, end } = startEndFromQuery(query);

  const isReady         = useSelector(state => player.isReady(state.player));
  const isMetadataReady = useSelector(state => player.isMetadataReady(state.player));
  const { duration }    = useSelector(state => player.getFile(state.player)) || {};

  const { isHLS }                    = useSelector(state => playlist.getPlayed(state.playlist));
  const { cuId, cId, isSingleMedia } = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);

  const historyItem = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY)?.find(x => x.content_unit_uid === cuId));
  const { fetched } = useSelector(state => my.getInfo(state.my, MY_NAMESPACE_HISTORY), shallowEqual);

  const dispatch     = useDispatch();
  const wasPlayedRef = useRef(false);

  //start from saved time on load or switch playlist item
  const _isReady = isHLS ? isMetadataReady : isReady;
  const isClip   = start || end !== Infinity;

  useEffect(() => {
    cId && (wasPlayedRef.current = false);
  }, [cId]);

  useEffect(() => {
    if (!_isReady || isClip || !fetched) return;

    const autostart = !!(wasPlayedRef.current || isSingleMedia);

    const { current_time: offset } = getSavedTime(cuId, historyItem);
    if (!isNaN(offset) && offset > 0 && (offset + 10 < duration)) {
      seek(offset);
    } else if (autostart) {
      play();
    }
    if (!autostart) {
      setTimeout(() => {
        pause();
        dispatch(actions.setLoaded(true));
      }, 0);
    }
    wasPlayedRef.current = true;
  }, [_isReady, isClip, cuId, duration, historyItem, isSingleMedia, fetched, dispatch]);

  return null;
};

export default BehaviorStartPlay;
