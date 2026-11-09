import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { actions as chroniclesActions } from '../../redux/modules/chronicles';
import { JWPLAYER_ID } from '../../helpers/consts';
import { remove } from './adapter';
import PlayerBehaviorBuilder from './PlayerBehaviorBuilder';

const Player = () => {
  const ref      = useRef();
  const dispatch = useDispatch();

  useEffect(() => () => {
    dispatch(chroniclesActions.pauseOnLeave());
    remove();
  }, [dispatch]);
  return (
    <>
      <PlayerBehaviorBuilder />
      {/* 16:9 until jwplayer replaces this host with its own (also 16:9) box — otherwise the player is 0px high
          for a moment after mounting and the page below jumps up and back down (CLS) */}
      <div id={JWPLAYER_ID} ref={ref} className="aspect-video"></div>
    </>
  );
};

export default Player;
