import React, { useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import { selectors as playlist } from '../../redux/modules/playlist';
import { selectors as player } from '../../redux/modules/player';
import { selectors as chrSelectors } from '../../redux/modules/chronicles';
import { ClientChroniclesContext } from '../../helpers/app-contexts';
import { usePrevious } from '../../helpers/utils';
import { getDuration, getMute } from '../../pkg/jwpAdapter/adapter';
import { getSavedTime } from './helper';

const buildAppendData = (autoPlay, item, file) => {

  const { id: file_uid, language: file_language, src: file_src } = file || false;
  const { id: unit_uid }                                         = item;

  return {
    unit_uid,
    file_uid,
    file_language,
    auto_play: autoPlay,
    current_time: getSavedTime(unit_uid, null),
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
      const _defaultUnload = (event === 'player-play') ? chronicles.append('player-stop', buildAppendData(autoPlay, item, file)) : null;
      chronicles.append(event, data, /*sync*/ false, _defaultUnload);
    }
  }, [event, prevEvent, file, item, autoPlay, isPlayerReady]);

  return null;
};

export default AppendChronicle;