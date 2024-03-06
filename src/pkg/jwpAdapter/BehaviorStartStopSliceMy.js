import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { startEndFromQuery } from '../../components/Player/Controls/helper';
import { seek, pause } from './adapter';
import { noop } from '../../helpers/utils';
import { stringify } from '../../helpers/url';
import {
  playlistGetItemByIdSelector,
  playlistGetNextIdSelector,
  playlistGetPlayedSelector,
  playerIsMetadataReadySelector,
  playerIsReadySelector
} from '../../redux/selectors';

const BehaviorStartStopSliceMy = () => {
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

  const isReady         = useSelector(playerIsReadySelector);
  const isMetadataReady = useSelector(playerIsMetadataReadySelector);
  const isHLS           = useSelector(playlistGetPlayedSelector)?.isHLS;
  const id              = useSelector(playlistGetNextIdSelector);

  const { properties, ap } = useSelector(playlistGetItemByIdSelector)(id);

  const link     = useMemo(() => id ? { search: stringify({ ...properties, ap }) } : null, [id, properties, ap]);
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
