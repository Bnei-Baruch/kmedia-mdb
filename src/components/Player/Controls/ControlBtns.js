import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fscreen from 'fscreen';
import { useTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';
import clsx from 'clsx';

import { actions } from '../../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import { stopBubbling } from '../../../helpers/utils';
import WebWrapTooltip from '../../shared/WebWrapTooltip';
import { useLocation } from 'react-router-dom';
import { getEmbedFromQuery } from '../../../helpers/player';
import { playerGetOverModeSelector, playerIsFullScreenSelector } from '../../../redux/selectors';

const lockLandscape = () => {
  try {
    window.screen.orientation.lock('landscape');
  } catch (e) {
    console.error(e);
  }
};

const unlockLandscape = () => {
  try {
    window.screen.orientation.unlock();
  } catch (e) {
    console.error(e);
  }
};

export const FullscreenBtn = ({ fullscreenRef }) => {
  const isFullScreen = useSelector(playerIsFullScreenSelector);
  const { t }        = useTranslation();

  const handleClick = () => {
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
  };

  const exitFullscreen = () => {
    unlockLandscape();
    fscreen.fullscreenElement && fscreen.exitFullscreen();
  };

  const enterFullScreenIOS = () => {
    const player = window.jwplayer();
    player.setFullscreen(true).setControls(true);
    player.once('fullscreen', exitFullScreenIOS);
    lockLandscape();
  };

  const exitFullScreenIOS = () => {
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
          <Icon fitted name={isFullScreen ? 'compress' : 'expand'}/>
        </div>
      }/>
  );
};

export const ShareBtn = () => {
  const mode     = useSelector(playerGetOverModeSelector);
  const dispatch = useDispatch();
  const { t }    = useTranslation();
  const location = useLocation();

  if (getEmbedFromQuery(location).embed) return null;

  const handleOpen = e => {
    stopBubbling(e);
    const newMode = (mode === PLAYER_OVER_MODES.share) ? PLAYER_OVER_MODES.none : PLAYER_OVER_MODES.share;
    dispatch(actions.setOverMode(newMode));
  };

  return (
    <WebWrapTooltip
      content={t('player.controls.share')}
      trigger={
        <div
          className={clsx('controls__settings', { 'active': PLAYER_OVER_MODES.share === mode })}
          onClick={handleOpen}
        >
          <Icon fitted name="share alternate"/>
        </div>
      }
    />
  );
};

export const SettingsBtn = () => {
  const mode     = useSelector(playerGetOverModeSelector);
  const { t }    = useTranslation();
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
        <div
          className={clsx('controls__settings', { 'active': [PLAYER_OVER_MODES.settings, PLAYER_OVER_MODES.languages].includes(mode) })}
          onClick={handleOpen}
        >
          <Icon fitted name="setting"/>
        </div>
      }
    />
  );
};

