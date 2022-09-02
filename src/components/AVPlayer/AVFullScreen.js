import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
/* TODO: used for player only need remove after player update*/
import fscreen from 'fscreen';
import { Icon } from 'semantic-ui-react';

const AVFullscreen = ({ element = null }) => {
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    fscreen.addEventListener('fullscreenchange', fullScreenChange);
    return () => fscreen.removeEventListener('fullscreenchange', fullScreenChange);
  });

  const fullScreenChange = () => {
    setFullScreen(isFullScreenElement());
  };

  const isFullScreenElement = () => fscreen.fullscreenElement !== null;

  const handleFullscreen = () => {
    if (isFullScreenElement()) {
      fscreen.exitFullscreen();
    } else {
      fscreen.requestFullscreen(element);
    }
  };

  return (
    <button
      type="button"
      className="player-button player-control-fullscreen"
      disabled={!element || !fscreen.fullscreenEnabled}
      onClick={handleFullscreen}
    >
      <Icon name={fullScreen ? 'compress' : 'expand'} />
    </button>
  );
};

AVFullscreen.propTypes = {
  element: PropTypes.object,
};

export default React.memo(AVFullscreen);
