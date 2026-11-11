import { useEffect, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';

import { ClientChroniclesContext } from '../../helpers/app-contexts';
import { filenameExtension, usePrevious } from '../../helpers/utils';
import { getDuration, getMute, takePlayTiming, wasReplaced } from '../../pkg/jwpAdapter/adapter';
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

const buildAppendData = (autoPlay, item, file, event, late = false) => {
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
    src_type    : item.isHLS ? 'hls' : filenameExtension(file?.name || ''),
    media_type  : file?.type,
    // Startup latency and stalls of the play segment this stop closes; takes (resets) it: once per stop.
    ...(event === 'player-stop' ? takePlayTiming(src, late) : {})
  };
};

// The stop of the open play, sent late (its own stop was lost): its file may no longer be the loaded one.
const appendLateStop = (chronicles, autoPlay, open) => {
  chronicles.append('player-stop', buildAppendData(autoPlay, open.current.item, open.current.file, 'player-stop', true));
  open.current = null;
};

const AppendChronicle = () => {
  const chronicles = useContext(ClientChroniclesContext);

  const event                       = useSelector(chroniclesGetEventSelector);
  const file                        = useSelector(playerGetFileSelector);
  const item                        = useSelector(playlistGetPlayedSelector);
  const { isSingleMedia: autoPlay } = useSelector(playlistGetInfoSelector);
  const prevEvent                   = usePrevious(event);
  const isPlayerReady               = useSelector(playerIsReadySelector);
  const open                        = useRef(null);   // the last play appended whose stop isn't appended yet: { item, file }

  // One stop per play. A file switch on the same path (audio/video, My-playlist ?ap=) only fires JWP destroyPlugin,
  // whose stop is skipped (player not ready), so the open play's stop is appended here.
  useEffect(() => {
    if (open.current && open.current.file?.src !== file?.src) appendLateStop(chronicles, autoPlay, open);
  }, [file, autoPlay, chronicles]);

  useEffect(() => {
    if (!isPlayerReady || !event || event === prevEvent) return;
    if (event === 'player-stop' && !open.current) return;                                 // no play to stop: already stopped
    if (event === 'player-play' && open.current && !wasReplaced(file?.src)) return;          // the open play goes on (JWP play after a stall or seek)
    if (event === 'player-play' && open.current) appendLateStop(chronicles, autoPlay, open);   // the last play's stop was lost

    const data           = buildAppendData(autoPlay, item, file, event);
    const _defaultUnload = (event === 'player-play') ? () => chronicles.append('player-stop', buildAppendData(autoPlay, item, file, 'player-stop')) : null;

    chronicles.append(event, data, /*sync*/ false, _defaultUnload);
    if (event === 'player-play') open.current = { item, file };
    if (event === 'player-stop') open.current = null;
  }, [event, prevEvent, file, item, autoPlay, isPlayerReady]);

  return null;
};

export default AppendChronicle;
