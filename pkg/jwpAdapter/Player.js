'use client';
import React, { useRef, useEffect } from 'react';
import { Ref } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';

import { actions as chroniclesActions } from '../../src/redux/modules/chronicles';
import { JWPLAYER_ID } from '../../src/helpers/consts';
import { remove } from './adapter';
import PlayerBehaviorBuilder from './PlayerBehaviorBuilder';
import Script from 'next/script';
import { playlistSlice } from '../../lib/redux/slices/playlistSlice/playlistSlice';
import { playerSlice } from '../../lib/redux/slices/playerSlice/playerSlice';

const Player = () => {
  const ref      = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(playlistSlice.actions.hydrateLocalstorage());
    return () => {
      dispatch(chroniclesActions.pauseOnLeave());
      remove();
    };
  }, []);

  const onLoadHandler = () => {
    dispatch(playerSlice.actions.playerLoaded());
  };

  return (
    <>
      <PlayerBehaviorBuilder />
      <Ref innerRef={ref}>
        <div id={JWPLAYER_ID}></div>
      </Ref>
      <Script
        src="https://cdn.jwplayer.com/libraries/mxNkRalL.js"
        onLoad={onLoadHandler}
      />
    </>
  );
};

export default Player;
