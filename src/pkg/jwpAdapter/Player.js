import React, { useRef, useEffect } from 'react';
import { Ref } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';

import { actions as chroniclesActions } from '../../redux/modules/chronicles';
import { JWPLAYER_ID } from '../../helpers/consts';
import PlayerBehavior from './PlayerBehavior';
import BehaviorStartPlay from './BehaviorStartPlay';
import BehaviorStartStopSlice from './BehaviorStartStopSlice';
import { remove } from './adapter';

const Player = () => {
  const ref      = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(chroniclesActions.pauseOnLeave());
      remove()
    };
  }, []);
  return (
    <>
      <PlayerBehavior />
      <BehaviorStartPlay />
      <BehaviorStartStopSlice />
      <Ref innerRef={ref}>
        <div id={JWPLAYER_ID}></div>
      </Ref>
    </>
  );
};

export default Player;
