import React, { useRef, useEffect } from 'react';
import { JWPLAYER_ID } from '../../helpers/consts';
import PlayerBehavior from './PlayerBehavior';
import BehaviorStartPlay from './BehaviorStartPlay';
import BehaviorStartStopSlice from './BehaviorStartStopSlice';
import isFunction from 'lodash/isFunction';

const Player = () => {
  const ref = useRef();

  useEffect(() => {
    return () => {
      const player = window.jwplayer(JWPLAYER_ID);
      isFunction(player?.remove) && player.remove();
    };
  }, []);

  return (
    <>
      <PlayerBehavior />
      <BehaviorStartPlay />
      <BehaviorStartStopSlice />
      <div ref={ref}>
        <div id={JWPLAYER_ID}></div>
      </div>
    </>
  );
};

export default Player;
