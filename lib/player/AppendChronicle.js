import { useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import { selectors as playlist } from '../redux/slices/playlistSlice/playlistSlice';
import { selectors as player } from '../redux/slices/playerSlice/playerSlice';
import { selectors as chrSelectors } from '../../src/redux/modules/chronicles';
import { ClientChroniclesContext } from '../../src/helpers/app-contexts';
import { usePrevious } from '../../src/helpers/hooks';
import { getDuration, getMute } from '../../pkg/jwpAdapter/adapter';
import { getSavedTime } from './helper';

const buildAppendData = (autoPlay, item, file) => {
  const { id: file_uid, language: file_language } = file || false;
  const { id: unit_uid }                          = item;

  return {
    unit_uid,
    file_uid,
    file_language,
    auto_play: autoPlay,
    current_time: getSavedTime(unit_uid, null)?.current_time || 0,
    duration: getDuration(),
    was_muted: getMute(),
  };
};

const AppendChronicle = () => {
  const chronicles = useContext(ClientChroniclesContext);

  const event                       = useSelector(state => chrSelectors.getEvent(state.chronicles));
  const file                        = useSelector(state => player.getFile(state.player));
  const item                        = useSelector(state => playlist.getPlayed(state.playlist));
  const { isSingleMedia: autoPlay } = useSelector(state => playlist.getInfo(state.playlist));
  const prevEvent                   = usePrevious(event);
  const isPlayerReady               = useSelector(state => player.isReady(state.player));

  useEffect(() => {
    if (isPlayerReady && event && event !== prevEvent) {
      const data           = buildAppendData(autoPlay, item, file);
      const _defaultUnload = (event === 'player-play') ? () => chronicles.append('player-stop', buildAppendData(autoPlay, item, file)) : null;

      chronicles.append(event, data, /*sync*/ false, _defaultUnload);
    }
  }, [event, prevEvent, file, item, autoPlay, isPlayerReady]);

  return null;
};

export default AppendChronicle;
