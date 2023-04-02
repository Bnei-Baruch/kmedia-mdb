import { useEffect, useRef } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { selectors as player, actions } from '../../redux/modules/player';
import { MY_NAMESPACE_HISTORY } from '../../helpers/consts';
import { useLocation } from 'react-router-dom';
import { startEndFromQuery } from '../../components/Player/Controls/helper';
import { getSavedTime } from '../../components/Player/helper';
import { selectors as playlist } from '../../redux/modules/playlist';
import { selectors as my } from '../../redux/modules/my';
import { seek, play } from './adapter';

const BehaviorStartPlay = () => {
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

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

    console.log('start bug: BehaviorStartPlay effect 1');
    const { current_time: offset } = getSavedTime(cuId, historyItem);
    if (!isNaN(offset) && offset > 0 && (offset + 10 < duration)) {
      seek(offset);
    }
    if (autostart) {
      play();
    } else {
      dispatch(actions.setLoaded(true));
    }
    console.log('start bug: BehaviorStartPlay effect 2');
    wasPlayedRef.current = true;
  }, [_isReady, isClip, cuId, duration, historyItem, isSingleMedia, fetched, dispatch]);

  return null;
};

export default BehaviorStartPlay;
