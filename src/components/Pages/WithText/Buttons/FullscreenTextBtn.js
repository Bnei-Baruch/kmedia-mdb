import React, { useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../../redux/modules/textPage';
import fscreen from 'fscreen';

const FullscreenTextBtn = () => {
  const isFullscreen = useSelector(state => selectors.getIsFullscreen(state.textPage));
  const dispatch     = useDispatch();

  useEffect(() => {
    const handleFS = () => dispatch(actions.setFullscreen(!!fscreen.fullscreenElement));

    fscreen.addEventListener('fullscreenchange', handleFS, false);

    return () => {
      dispatch(actions.setFullscreen(false));
      fscreen.fullscreenElement && fscreen.exitFullscreen();
      fscreen.removeEventListener('fullscreenchange', handleFS, false);
    };
  }, []);

  const handleFullscreen = () => {
    fscreen.fullscreenElement && fscreen.exitFullscreen();
    if (!isFullscreen) {
      fscreen.requestFullscreen(document.documentElement);
    }
  };

  const icon = !isFullscreen ? 'fullscreen' : 'fullscreen_exit';
  return (
    <Button
      compact
      size="small"
      onClick={handleFullscreen}
      icon={
        <span className="material-symbols-outlined">
          {icon}
        </span>
      }
    />
  );
};

export default FullscreenTextBtn;
