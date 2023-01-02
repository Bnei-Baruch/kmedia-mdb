import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fscreen from 'fscreen';
import { withNamespaces } from 'react-i18next';
import { Icon } from 'semantic-ui-react';

import { actions, selectors } from '../../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import { stopBubbling } from '../../../helpers/utils';
import WebWrapTooltip from '../../shared/WebWrapTooltip';

const lockLandscape        = () => {
  try {
    window.screen.orientation.lock('landscape');
  } catch (e) {
    console.error(e);
  }
};
const unlockLandscape      = () => {
  try {
    window.screen.orientation.unlock();
  } catch (e) {
    console.error(e);
  }
};
export const FullscreenBtn = withNamespaces()(({ fullscreenRef, t }) => {
  const dispatch     = useDispatch();
  const isFullScreen = useSelector(state => selectors.isFullScreen(state.player));

  const handleClick     = () => {
    if (!fscreen.fullscreenEnabled) {
      enterFullScreenIOS();
      return;
    }
    if (fscreen.fullscreenElement !== null) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };
  const enterFullscreen = () => {
    fscreen.requestFullscreen(fullscreenRef.current).then(lockLandscape);
    dispatch(actions.setFullScreen(true));
  };
  const exitFullscreen  = () => {
    unlockLandscape();
    dispatch(actions.setFullScreen(false));
    fscreen.fullscreenElement && fscreen.exitFullscreen();
  };

  const enterFullScreenIOS = () => {
    const player = window.jwplayer();
    player.setFullscreen(true).setControls(true);
    dispatch(actions.setFullScreen(false));
    player.once('fullscreen', exitFullScreenIOS);
    lockLandscape();
  };

  const exitFullScreenIOS = () => {
    dispatch(actions.setFullScreen(false));
    unlockLandscape();
    const player = window.jwplayer();
    player.setControls(false);
  };

  return (
    <WebWrapTooltip
      content={t(`player.controls.${isFullScreen ? 'fullscreen-exit' : 'fullscreen'}`)}
      position="top right"
      trigger={
        <div className="controls__fullscreen" onClick={handleClick}>
          <Icon fitted name={isFullScreen ? 'compress' : 'expand'} />
        </div>
      } />
  );
});

export const ShareBtn = withNamespaces()(({ t }) => {
  const mode     = useSelector(state => selectors.getOverMode(state.player));
  const dispatch = useDispatch();

  const handleOpen = e => {
    stopBubbling(e);
    const newMode = (mode === PLAYER_OVER_MODES.share) ? PLAYER_OVER_MODES.none : PLAYER_OVER_MODES.share;
    dispatch(actions.setOverMode(newMode));
  };

  return (
    <WebWrapTooltip
      content={t('player.controls.share')}
      trigger={
        <div className="controls__share" onClick={handleOpen}>
          <Icon fitted name="share alternate" />
        </div>
      }
    />
  );
});

export const SettingsBtn = withNamespaces()(({ t }) => {
  const mode = useSelector(state => selectors.getOverMode(state.player));

  const dispatch = useDispatch();

  const handleOpen = e => {
    stopBubbling(e);
    const newMode = (mode === PLAYER_OVER_MODES.settings) ? PLAYER_OVER_MODES.none : PLAYER_OVER_MODES.settings;
    dispatch(actions.setOverMode(newMode));
  };

  return (
    <WebWrapTooltip
      content={t('player.controls.settings')}
      trigger={
        <div className="controls__settings" onClick={handleOpen}>
          <Icon fitted name="setting" />
        </div>
      }
    />
  );
});
