import React, { useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import fscreen from 'fscreen';
import { textPageGetUrlInfoSelector, textPageGetIsFullscreenSelector } from '../../../../redux/selectors';

const FullscreenTextBtn = () => {
  const isFullscreen = useSelector(textPageGetIsFullscreenSelector);
  const hasSel       = !!useSelector(textPageGetUrlInfoSelector).select;
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

  if (hasSel) return null;

  const handleFullscreen = () => {
    fscreen.fullscreenElement && fscreen.exitFullscreen();
    if (!isFullscreen) {
      fscreen.requestFullscreen(document.documentElement);
    }
  };

  const icon = !isFullscreen ? 'fullscreen' : 'fullscreen_exit';
  return (
    <Button
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
