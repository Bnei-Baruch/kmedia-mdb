import { useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import { ClientChroniclesContext } from '../../helpers/app-contexts';
import { usePrevious } from '../../helpers/utils';
import { getDuration, getMute } from '../../pkg/jwpAdapter/adapter';
import { getSavedTime } from './helper';
import {
  chroniclesGetEventSelector,
  playerGetFileSelector,
  playlistGetInfoSelector,
  playlistGetPlayedSelector,
  playerIsReadySelector
} from '../../redux/selectors';

const buildAppendData = (autoPlay, item, file) => {
  const { id: file_uid, language: file_language } = file || false;
  const { id: unit_uid }                          = item;

  return {
    unit_uid,
    file_uid,
    file_language,
    auto_play   : autoPlay,
    current_time: getSavedTime(unit_uid, null),
    duration    : getDuration(),
    was_muted   : getMute()
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
      const data           = buildAppendData(autoPlay, item, file);
      const _defaultUnload = (event === 'player-play') ? () => chronicles.append('player-stop', buildAppendData(autoPlay, item, file)) : null;

      chronicles.append(event, data, /*sync*/ false, _defaultUnload);
    }
  }, [event, prevEvent, file, item, autoPlay, isPlayerReady]);

  return null;
};

export default AppendChronicle;
