import React, { useRef, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Ref } from 'semantic-ui-react';

import { selectors as player, selectors, actions } from '../../redux/modules/player';
import { PLAYER_OVER_MODES, MT_AUDIO } from '../../helpers/consts';
import Player from '../../pkg/jwpAdapter/Player';
import PlayerToolsWeb from './PlayerToolsWeb';
import PlayerToolsMobile from './PlayerToolsMobile';
import AppendChronicle from './AppendChronicle';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import UpdateLocation from './UpdateLocation';
import { useKeyboardControl } from './hooks/useKeyboardControl';

const HIDE_CONTROLS_TIMEOUT = 3000;

let timeout;
const sleep = ms => new Promise(r => {
  timeout && clearTimeout(timeout);
  timeout = setTimeout(r, ms);
});

const runTimeout = dispatch => {
  sleep(HIDE_CONTROLS_TIMEOUT).then(() => {
    dispatch(actions.setOverMode(PLAYER_OVER_MODES.none));
  });
};

const CLASSES_BY_MODE = {
  [PLAYER_OVER_MODES.settings]: 'is-settings',
  [PLAYER_OVER_MODES.languages]: 'is-settings is-language',
  [PLAYER_OVER_MODES.share]: 'is-sharing',
  [PLAYER_OVER_MODES.active]: 'is-active',
  [PLAYER_OVER_MODES.dragKnob]: 'is-active',
  [PLAYER_OVER_MODES.firstTime]: 'is-active is-first-time',
  [PLAYER_OVER_MODES.none]: '',
};

const PlayerContainer = () => {
  const fullscreenRef = useRef();
  const mode          = useSelector(state => player.getOverMode(state.player));
  const isFullScreen  = useSelector(state => selectors.isFullScreen(state.player));

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { type }           = useSelector(state => selectors.getFile(state.player)) || false;

  const dispatch = useDispatch();
  useKeyboardControl(runTimeout);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = fullscreenRef.current === document.fullscreenElement;
      dispatch(actions.setFullScreen(isFull));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [fullscreenRef, dispatch]);

  useEffect(() => {
    if (mode === PLAYER_OVER_MODES.active) {
      runTimeout(dispatch);
    }

    return () => clearTimeout(timeout);
  }, [mode]);

  const handleClick = e => {
    if (mode === PLAYER_OVER_MODES.active) {
      if (e.target.className.indexOf('icon') !== -1 || e.target.tagName === 'LABEL') {
        runTimeout(dispatch);
        return;
      }

      clearTimeout(timeout);
      dispatch(actions.setOverMode(PLAYER_OVER_MODES.none));

    }

    if (mode === PLAYER_OVER_MODES.none) {
      dispatch(actions.setOverMode(PLAYER_OVER_MODES.active));
    }
  };

  const handleMouseMove = e => {
    if (mode === PLAYER_OVER_MODES.none && !isMobileDevice) {
      dispatch(actions.setOverMode(PLAYER_OVER_MODES.active));
    }
  };

  const playerComponent = <Player />;
  const isVideo         = type !== MT_AUDIO;
  const classes         = [
    mode === PLAYER_OVER_MODES.none && !isVideo ? CLASSES_BY_MODE[PLAYER_OVER_MODES.firstTime] : CLASSES_BY_MODE[mode],
    isMobileDevice ? 'is-mobile' : 'is-web',
    { 'is-fullscreen': isFullScreen, 'is-video': isVideo },

  ];

  const content = (
    <div className="player" dir="ltr">
      <AppendChronicle />
      <UpdateLocation />
      <div
        className={clsx(...classes)}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      >
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
    <div>
      <Ref innerRef={fullscreenRef}>
        {content}
      </Ref>
    </div>
  );
};

export default PlayerContainer;
