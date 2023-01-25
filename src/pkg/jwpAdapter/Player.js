import React, { useRef, useEffect } from 'react';
import { JWPLAYER_ID } from '../../helpers/consts';
import PlayerBehavior from './PlayerBehavior';
import BehaviorStartPlay from './BehaviorStartPlay';
import BehaviorStartStopSlice from './BehaviorStartStopSlice';
import isFunction from 'lodash/isFunction';
import { Ref } from 'semantic-ui-react';
import { actions } from '../../redux/modules/chronicles';
import { useDispatch } from 'react-redux';

const Player = () => {
  const ref      = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(actions.pauseOnLeave());
      const player = window.jwplayer(JWPLAYER_ID);
      //TODO david; temporary fix double rerender need to remove after update react-router and use singleton player component
      setTimeout(() => isFunction(player?.remove) && player.remove(), 0);
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

export default React.memo(Player, () => true);
