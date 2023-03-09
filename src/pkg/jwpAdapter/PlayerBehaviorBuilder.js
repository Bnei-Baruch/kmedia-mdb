import React from 'react';
import BehaviorStartPlay from './BehaviorStartPlay';
import BehaviorStartStopSlice from './BehaviorStartStopSlice';
import { useSelector } from 'react-redux';
import PlayerBehavior from './PlayerBehavior';
import { selectors as playlist } from '../../redux/modules/playlist';
import PlayerBehaviorHls from './PlayerBehaviorHls';
import PlayerFetchMetadataHls from './PlayerFetchMetadataHls';

const PlayerBehaviorBuilder = () => {
  const isHLS = useSelector(state => playlist.getPlayed(state.playlist).isHLS);

  return (
    <>
      <PlayerBehavior />
      <BehaviorStartPlay />
      <BehaviorStartStopSlice />
      {
        isHLS && <PlayerFetchMetadataHls />
      }
      {
        isHLS && <PlayerBehaviorHls />
      }
    </>
  );
};

export default PlayerBehaviorBuilder;
