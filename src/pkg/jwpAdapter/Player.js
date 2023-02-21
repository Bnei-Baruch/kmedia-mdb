import React, { useRef, useEffect } from 'react';
import { JWPLAYER_ID } from '../../helpers/consts';
import PlayerBehavior from './PlayerBehavior';
import BehaviorStartPlay from './BehaviorStartPlay';
import BehaviorStartStopSlice from './BehaviorStartStopSlice';
import { Ref } from 'semantic-ui-react';
import { actions } from '../../redux/modules/chronicles';
import { useDispatch } from 'react-redux';

const Player = () => {
  const ref      = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(actions.pauseOnLeave());
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
