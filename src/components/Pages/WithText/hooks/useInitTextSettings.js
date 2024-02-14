import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';

export const useInitTextSettings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const { fontType, theme, zoomSize } = JSON.parse(localStorage.getItem('library-settings')) || {};
    zoomSize && dispatch(actions.setZoomSize(zoomSize));
    fontType && dispatch(actions.setFontType(fontType));
    theme && dispatch(actions.setTheme(theme));
  }, []);

  return null;
};

