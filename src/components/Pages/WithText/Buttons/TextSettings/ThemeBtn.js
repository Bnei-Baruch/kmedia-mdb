import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, actions } from '../../../../../redux/modules/textPage';

const THEME_LIGHT = 'light';
const THEME_DARK  = 'dark';
const THEME_SEPIA = 'sepia';

const btns = [THEME_DARK, THEME_LIGHT, THEME_SEPIA];

const ThemeBtn = () => {
  const theme          = useSelector(state => selectors.getSettings(state.textPage).theme);
  const dispatch       = useDispatch();
  const handleSetTheme = d => dispatch(actions.setTheme(d));

  return (
    <>
      {
        btns.map(d => (
          <Menu.Item
            key={d}
            onClick={() => handleSetTheme(d)}
            active={d === theme}
            content={d}
          />
        ))
      }
    </>
  );
};

export default ThemeBtn;
