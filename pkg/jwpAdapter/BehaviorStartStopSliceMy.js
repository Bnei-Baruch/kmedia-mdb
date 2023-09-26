import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { startEndFromQuery } from '../../lib/player/Controls/helper';
import { selectors as player } from '../../lib/redux/slices/playerSlice/playerSlice';
import { selectors as playlist, selectors } from '../../lib/redux/slices/playlistSlice/playlistSlice';
import { seek, pause } from './adapter';
import { noop } from '../../src/helpers/utils';
import { stringify } from '../../src/helpers/url';

const BehaviorStartStopSliceMy = () => {
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

  const isReady         = useSelector(state => player.isReady(state.player));
  const isMetadataReady = useSelector(state => player.isMetadataReady(state.player));
  const isHLS           = useSelector(state => playlist.getPlayed(state.playlist)?.isHLS);
  const id              = useSelector(state => selectors.getNextId(state.playlist));

  const { properties, ap } = useSelector(state => selectors.getItemById(state.playlist)(id));

  const link     = id ? { search: stringify({ ...properties, ap }) } : null;
  const navigate = useNavigate();

  const _isReady = isHLS ? isMetadataReady : isReady;

  const dispatch = useDispatch();
  useEffect(() => {
    if (!_isReady || (!start && end === Infinity)) return noop;

    const jwp           = window.jwplayer();
    const checkStopTime = d => {
      if (d.currentTime < end) return;
      jwp.off('time', checkStopTime);

      if (link) navigate(link);
      else pause();
    };
    seek(start);
    jwp.on('time', checkStopTime);
    return () => jwp.off('time', checkStopTime);
  }, [_isReady, start, end, link, navigate, dispatch]);
  return null;
};

export default BehaviorStartStopSliceMy;
