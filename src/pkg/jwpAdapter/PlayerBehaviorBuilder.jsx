import React from 'react';
import BehaviorStartPlay from './BehaviorStartPlay';
import BehaviorStartStopSlice from './BehaviorStartStopSlice';
import BehaviorStartStopSliceMy from './BehaviorStartStopSliceMy';
import { useSelector } from 'react-redux';
import PlayerBehavior from './PlayerBehavior';
import PlayerBehaviorHls from './PlayerBehaviorHls';
import AutoStartNotAllowed from './AutoStartNotAllowed';
import SwitchSubtitles from './SwitchSubtitles';
import { playlistGetInfoSelector, playlistGetPlayedSelector } from '../../redux/selectors';

const PlayerBehaviorBuilder = () => {
  const isHLS = useSelector(playlistGetPlayedSelector)?.isHLS;
  const { isMy }  = useSelector(playlistGetInfoSelector);

  return (
    <>
      <AutoStartNotAllowed/>
      <PlayerBehavior/>
      <BehaviorStartPlay/>
      <BehaviorStartStopSlice/>
      <SwitchSubtitles/>
      {isMy ? <BehaviorStartStopSliceMy/> : <BehaviorStartStopSlice/>}
      {isHLS && <PlayerBehaviorHls/>}
    </>
  );
};

export default PlayerBehaviorBuilder;
