import React, { useState } from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { actions } from '../../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import { stopBubbling } from '../../../helpers/utils';
import { useDispatch } from 'react-redux';
import fscreen from 'fscreen';

export const FullscreenBtn = ({ fullScreen }) => {
  const [on, setOn] = useState(false);

  const handleFullScreen = () => {
    if (!on) {
      fullScreen();
      setOn(true);
    } else {
      fscreen.exitFullscreen();
      setOn(false);
    }
  };
  return (
    <Popup content="Fullscreen" inverted size="mini" position="top right" trigger={
      <div className="controls__fullscreen" onClick={handleFullScreen}>
        <Icon fitted name={on ? 'compress' : 'expand'} />
      </div>
    } />
  );
};

export const ShareBtn = () => {
  const dispatch = useDispatch();

  const handleOpen = e => {
    dispatch(actions.setOverMode(PLAYER_OVER_MODES.share));
    stopBubbling(e);
  };

  return (
    <Popup content="Share" inverted size="mini" position="top center" trigger={
      <div className="controls__share" onClick={handleOpen}>
        <Icon fitted name="share alternate" />
      </div>
    } />
  );
};

export const SettingsBtn = () => {
  const dispatch = useDispatch();

  const handleOpen = e => {
    dispatch(actions.setOverMode(PLAYER_OVER_MODES.settings));
    stopBubbling(e);
  };

  return (
    <Popup content="Settings" inverted size="mini" position="top center" trigger={
      <div className="controls__settings" onClick={handleOpen}>
        <Icon fitted name="setting" />
      </div>
    } />
  );
};
