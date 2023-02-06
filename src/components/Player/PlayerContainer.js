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

const HIDE_CONTROLS_TIMEOUT = 3000;

let timeout;
const runTimeout          = (dispatch) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    dispatch(actions.setOverMode(PLAYER_OVER_MODES.none));
  }, HIDE_CONTROLS_TIMEOUT);
};
const CONTROL_BTS_CLASSES = ['controls__pause'];

const CLASSES_BY_MODE = {
  [PLAYER_OVER_MODES.settings]: 'is-settings',
  [PLAYER_OVER_MODES.languages]: 'is-settings is-language',
  [PLAYER_OVER_MODES.share]: 'is-sharing',
  [PLAYER_OVER_MODES.active]: 'is-active',
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
    if (mode === PLAYER_OVER_MODES.active) {
      runTimeout(dispatch);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [mode]);

  const handleTouch = (e) => {
    if (mode === PLAYER_OVER_MODES.active) {
      if (e.target.className.indexOf('icon') === -1) {
        clearTimeout(timeout);
        dispatch(actions.setOverMode(PLAYER_OVER_MODES.none));
      } else {
        runTimeout(dispatch);
      }
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
        onTouchStart={handleTouch}
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
