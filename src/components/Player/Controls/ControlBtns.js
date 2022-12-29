import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fscreen from 'fscreen';
import { withNamespaces } from 'react-i18next';
import { Icon } from 'semantic-ui-react';

import { actions, selectors } from '../../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import { stopBubbling } from '../../../helpers/utils';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

export const FullscreenBtn = withNamespaces()(({ openOnFull, t }) => {
  const dispatch           = useDispatch();
  const isFullScreen       = useSelector(state => selectors.isFullScreen(state.player));
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const handleClick     = () => {
    if ((fscreen.fullscreenEnabled && fscreen.fullscreenElement !== null) || isFullScreen) {
      exitFullScreen();
    } else {
      enterFullScreen();
    }
  };
  const enterFullScreen = () => {
    openOnFull();
    dispatch(actions.setFullScreen(true));
    try {
      isMobileDevice && window.screen.orientation.lock('landscape');
    } catch (e) {
      console.error(e);
    }
    window.scrollTo(0, 0);
  };
  const exitFullScreen  = () => {
    try {
      isMobileDevice && window.screen.orientation.unlock();
    } catch (e) {
      console.error(e);
    }

    if (fscreen.fullscreenEnabled) {
      fscreen.fullscreenElement && fscreen.exitFullscreen();
    }
    dispatch(actions.setFullScreen(false));
  };
  return (
    <WebWrapTooltip
      content={t(`player.controls.${isFullScreen ? 'fullscreen-exit' : 'fullscreen-enter'}`)}
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
