import React from 'react';
import { Menu } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../../redux/modules/textPage';
import { textPageGetSettings } from '../../../../../redux/selectors';

const THEME_LIGHT = 'light';
const THEME_DARK  = 'dark';
const THEME_SEPIA = 'sepia';

const btns = [THEME_DARK, THEME_LIGHT, THEME_SEPIA];

const ThemeBtn = () => {
  const { theme }      = useSelector(textPageGetSettings);
  const dispatch       = useDispatch();
  const handleSetTheme = d => dispatch(actions.setTheme(d));

  return (
    <>
      {
        btns.map(d => (
          <Menu.Item
            key={d}
            onClick={() => handleSetTheme(d)}
            className={`text__theme-btn_${d}`}
            active={d === theme}
            content={d}
          />
        ))
      }
    </>
  );
};

export default ThemeBtn;
