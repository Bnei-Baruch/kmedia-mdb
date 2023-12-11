import React, { useRef, useEffect } from 'react';
import { Ref } from 'semantic-ui-react';
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
      <Ref innerRef={ref}>
        <div id={JWPLAYER_ID}></div>
      </Ref>
    </>
  );
};

export default Player;
