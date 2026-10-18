import { useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import { ClientChroniclesContext } from '../../helpers/app-contexts';
import { usePrevious } from '../../helpers/utils';
import { getDuration, getMute, takePlayTiming } from '../../pkg/jwpAdapter/adapter';
import { getSavedTime } from './helper';
import {
  chroniclesGetEventSelector,
  playerGetFileSelector,
  playlistGetInfoSelector,
  playlistGetPlayedSelector,
  playerIsReadySelector
} from '../../redux/selectors';

const hostOf = url => {
  try {
    return new URL(url).host;
  } catch (e) {
    return '';
  }
};

const buildAppendData = (autoPlay, item, file, event) => {
  const { id: file_uid, language: file_language } = file || false;
  const { id: unit_uid }                          = item;
  const src                                       = file?.src || '';

  return {
    unit_uid,
    file_uid,
    file_language,
    auto_play   : autoPlay,
    current_time: getSavedTime(unit_uid, null),
    duration    : getDuration(),
    was_muted   : getMute(),
    // Media source + type, to slice latency by origin (cdn/files) and protocol.
    src_host    : hostOf(src),
    src_type    : item.isHLS ? 'hls' : src.split('?')[0].split('.').pop(),
    media_type  : file?.type,
    // Startup latency and stalls of the play segment this stop closes (null click_to_play_ms = never started).
    ...(event === 'player-stop' ? takePlayTiming(src) : {})
  };
};

const AppendChronicle = () => {
  const chronicles = useContext(ClientChroniclesContext);

  const event                       = useSelector(chroniclesGetEventSelector);
  const file                        = useSelector(playerGetFileSelector);
  const item                        = useSelector(playlistGetPlayedSelector);
  const { isSingleMedia: autoPlay } = useSelector(playlistGetInfoSelector);
  const prevEvent                   = usePrevious(event);
  const isPlayerReady               = useSelector(playerIsReadySelector);

  useEffect(() => {
    if (isPlayerReady && event && event !== prevEvent) {
      const data           = buildAppendData(autoPlay, item, file, event);
      const _defaultUnload = (event === 'player-play') ? () => chronicles.append('player-stop', buildAppendData(autoPlay, item, file, 'player-stop')) : null;

      chronicles.append(event, data, /*sync*/ false, _defaultUnload);
    }
  }, [event, prevEvent, file, item, autoPlay, isPlayerReady]);

  return null;
};

export default AppendChronicle;
