import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../../redux/modules/textPage';
import { textPageGetSettings } from '../../../../../redux/selectors';

const THEME_LIGHT = 'light';
const THEME_DARK  = 'dark';
const THEME_SEPIA = 'sepia';

const btns = [THEME_LIGHT, THEME_DARK, THEME_SEPIA];

const ThemeBtn = () => {
  const { theme }      = useSelector(textPageGetSettings);
  const dispatch       = useDispatch();
  const handleSetTheme = d => dispatch(actions.setTheme(d));

  return (
    <>
      {
        btns.map(d => (
          <button
            key={d}
            onClick={() => handleSetTheme(d)}
            className={`text__theme-btn_${d} flex-1 px-4 py-2 text-center ${d === theme ? 'bg-blue-50 font-semibold' : ''}`}
          >
            {d}
          </button>
        ))
      }
    </>
  );
};

export default ThemeBtn;
