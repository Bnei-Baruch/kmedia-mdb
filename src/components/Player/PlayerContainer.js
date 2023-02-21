import React, { useRef, useContext, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { selectors as player, selectors, actions } from '../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../helpers/consts';
import Player from '../../pkg/jwpAdapter/Player';
import UpdateLocation from './UpdateLocation';
import PlayerToolsWeb from './PlayerToolsWeb';
import PlayerToolsMobile from './PlayerToolsMobile';
import AppendChronicle from './AppendChronicle';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import clsx from 'clsx';
import { Ref } from 'semantic-ui-react';
import { seek, getPosition, setVolume, getVolume, togglePlay, getDuration } from '../../pkg/jwpAdapter/adapter';

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
  const mode          = useSelector(state => player.getOverMode(state.player), shallowEqual);
  const isFullScreen  = useSelector(state => selectors.isFullScreen(state.player), shallowEqual);

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log(e);
      if (e.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }
      const coef = e.shiftKey ? 2 : e.altKey ? 0.2 : 1;
      switch (e.key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown': {
        const v = getVolume();
        setVolume(Math.max(0, v - coef * 5));
        break;
      }
      case 'Up': // IE/Edge specific value
      case 'ArrowUp': {
        const v = getVolume();
        setVolume(Math.min(100, v + coef * 5));
        break;
      }
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft': {
        const pos = getPosition();
        seek(Math.max(pos - coef * 10, 0));
        break;
      }
      case 'Right': // IE/Edge specific value
      case 'ArrowRight': {
        const pos = getPosition();
        seek(Math.min(pos + coef * 10, getDuration()));
        break;
      }
      case 'Esc': // IE/Edge specific value
      case 'Escape':
        break;
      case ' ':
        togglePlay();
        break;
      default:
        return;
      }

      if (mode === PLAYER_OVER_MODES.active) {
        runTimeout(dispatch);
      }
      if (mode === PLAYER_OVER_MODES.none) {
        dispatch(actions.setOverMode(PLAYER_OVER_MODES.active));
      }
      e.preventDefault();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = fullscreenRef.current === document.fullscreenElement;
      dispatch(actions.setFullScreen(isFull));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }
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

  const handleMouseMove = (e) => {
    if (mode === PLAYER_OVER_MODES.none && !isMobileDevice) {
      dispatch(actions.setOverMode(PLAYER_OVER_MODES.active));
    }
  };

  const content = (
    <div className="player" dir="ltr">
      <AppendChronicle />
      <UpdateLocation />
      <div
        className={clsx(CLASSES_BY_MODE[mode], isMobileDevice ? 'is-mobile' : 'is-web', { 'is-fullscreen': isFullScreen })}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      >
        {
          isMobileDevice ? (
            <PlayerToolsMobile Player={<Player />} fullscreenRef={fullscreenRef} />
          ) : (
            <>
              <Player />
              <PlayerToolsWeb fullscreenRef={fullscreenRef} />
            </>
          )
        }
      </div>
    </div>
  );

  return (
    <Ref innerRef={fullscreenRef}>
      {content}
    </Ref>
  );
};
//TODO david remove memo after react-router update
export default React.memo(PlayerContainer);
