import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { actions as chroniclesActions } from '../../redux/modules/chronicles';
import { JWPLAYER_ID } from '../../helpers/consts';
import { remove } from './adapter';
import PlayerBehaviorBuilder from './PlayerBehaviorBuilder';

const Player = () => {
  const dispatch = useDispatch();

  useEffect(() => () => {
    dispatch(chroniclesActions.pauseOnLeave());
    remove();
  }, []);

  return (
    <>
      <PlayerBehaviorBuilder />
      <div id={JWPLAYER_ID}></div>
    </>
  );
};

export default Player;
