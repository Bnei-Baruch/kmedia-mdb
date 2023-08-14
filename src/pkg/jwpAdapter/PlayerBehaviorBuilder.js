import React from 'react';
import BehaviorStartPlay from './BehaviorStartPlay';
import BehaviorStartStopSlice from './BehaviorStartStopSlice';
import BehaviorStartStopSliceMy from './BehaviorStartStopSliceMy';
import { useSelector } from 'react-redux';
import PlayerBehavior from './PlayerBehavior';
import { selectors as playlist, selectors } from '../../redux/modules/playlist';
import PlayerBehaviorHls from './PlayerBehaviorHls';
import AutoStartNotAllowed from './AutoStartNotAllowed';
import SwitchSubtitles from './SwitchSubtitles';
import { isPlayerLoaded } from './adapter';

const PlayerBehaviorBuilder = () => {
  const isHLS = useSelector(state => playlist.getPlayed(state.playlist)?.isHLS);
  const isMy  = useSelector(state => selectors.getInfo(state.playlist).isMy);

  if (!isPlayerLoaded()) return null;
  return (
    <>
      <AutoStartNotAllowed />
      <PlayerBehavior />
      <BehaviorStartPlay />
      <BehaviorStartStopSlice />
      <SwitchSubtitles />
      {isMy ? <BehaviorStartStopSliceMy /> : <BehaviorStartStopSlice />}
      {isHLS && <PlayerBehaviorHls />}
    </>
  );
};

export default PlayerBehaviorBuilder;
