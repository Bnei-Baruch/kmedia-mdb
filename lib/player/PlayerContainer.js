'use client';
import React, { useRef, useContext, useEffect, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Ref } from 'semantic-ui-react';

import { selectors, playerSlice } from '../redux/slices/playerSlice/playerSlice';
import { PLAYER_OVER_MODES, MT_AUDIO } from '../../src/helpers/consts';
import Player from '../../pkg/jwpAdapter/Player';
import PlayerToolsWeb from './PlayerToolsWeb';
import PlayerToolsMobile from './PlayerToolsMobile';
import { DeviceInfoContext } from '../../src/helpers/app-contexts';
import { useKeyboardControl } from './hooks/useKeyboardControl';
import UpdateLocation from './UpdateLocation';
import { playlistSlice } from '../redux/slices/playlistSlice/playlistSlice';

const HIDE_CONTROLS_TIMEOUT = 4000;

let timeout;
const sleep = ms => new Promise(r => {
  timeout && clearTimeout(timeout);
  timeout = setTimeout(r, ms);
});

const runTimeout = dispatch => {
  sleep(HIDE_CONTROLS_TIMEOUT).then(() => {
    dispatch(playerSlice.actions.setOverMode(PLAYER_OVER_MODES.none));
  });
};

const CLASSES_BY_MODE = {
  [PLAYER_OVER_MODES.settings]: 'is-settings',
  [PLAYER_OVER_MODES.languages]: 'is-settings is-language',
  [PLAYER_OVER_MODES.share]: 'is-sharing',
  [PLAYER_OVER_MODES.tagging]: 'is-sharing is-tagging',
  [PLAYER_OVER_MODES.playlist]: 'is-sharing is-tagging',
  [PLAYER_OVER_MODES.active]: 'is-active',
  [PLAYER_OVER_MODES.dragKnob]: 'is-active',
  [PLAYER_OVER_MODES.firstTime]: 'is-active is-first-time',
  [PLAYER_OVER_MODES.none]: '',
};

export const PlayerContext = createContext(null);
const PlayerContainer      = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const fullscreenRef = useRef();

  const mode         = useSelector(state => selectors.getOverMode(state.player));
  const isFullScreen = useSelector(state => selectors.isFullScreen(state.player));
  const { type }     = useSelector(state => selectors.getFile(state.player)) || false;
  const isAudio      = type === MT_AUDIO;

  const dispatch = useDispatch();
  useKeyboardControl(runTimeout);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = fullscreenRef.current === document.fullscreenElement;
      dispatch(playerSlice.actions.setFullScreen(isFull));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [fullscreenRef, dispatch]);

  useEffect(() => {
    if (mode === PLAYER_OVER_MODES.active && !isAudio) {
      runTimeout(dispatch);
    }

    return () => clearTimeout(timeout);
  }, [mode, isAudio, dispatch]);

  const showControls = (withHide = true) => {
    clearTimeout(timeout);
    if (mode === PLAYER_OVER_MODES.none) {
      dispatch(playerSlice.actions.setOverMode(PLAYER_OVER_MODES.active));
    } else if (mode === PLAYER_OVER_MODES.active && withHide) {
      runTimeout(dispatch);
    }
  };
  const hideControls = () => {
    clearTimeout(timeout);
    runTimeout(dispatch);
  };

  const handleTouchEnd = e => {
    clearTimeout(timeout);

    if (mode === PLAYER_OVER_MODES.none) {
      dispatch(playerSlice.actions.setOverMode(PLAYER_OVER_MODES.active));
    }
    if (mode !== PLAYER_OVER_MODES.active) return;

    if (e.target.className.indexOf('icon') !== -1 || e.target.tagName === 'LABEL') {
      runTimeout(dispatch);
    } else {
      dispatch(playerSlice.actions.setOverMode(PLAYER_OVER_MODES.none));
    }
  };

  const playerComponent = <Player />;
  const classes         = [
    mode === PLAYER_OVER_MODES.none && isAudio ? CLASSES_BY_MODE[PLAYER_OVER_MODES.firstTime] : CLASSES_BY_MODE[mode],
    isMobileDevice ? 'is-mobile' : 'is-web',
    { 'is-fullscreen': isFullScreen, 'is-video': !isAudio },

  ];

  const content = (
    <div className="player" dir="ltr">
      {/*<AppendChronicle />*/}
      {/*<UpdateLocation />*/}
      <div className={clsx(...classes)}>
        {
          isMobileDevice ? (
            <PlayerToolsMobile Player={playerComponent} fullscreenRef={fullscreenRef} />
          ) : (
            <>
              {playerComponent}
              <PlayerToolsWeb fullscreenRef={fullscreenRef} />
            </>
          )
        }
      </div>
    </div>
  );

  return (
    <PlayerContext.Provider value={{ showControls, hideControls }}>
      <div onTouchEnd={handleTouchEnd}>
        <Ref innerRef={fullscreenRef}>
          {content}
        </Ref>
      </div>
    </PlayerContext.Provider>
  );
};

export default PlayerContainer;