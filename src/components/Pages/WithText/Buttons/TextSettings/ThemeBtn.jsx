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
            className={`text__theme-btn_${d} flex-1 min-w-0 px-4 py-[14.86px] leading-none text-center capitalize whitespace-nowrap ${d === theme ? 'bg-black/5' : ''}`}
          >
            {d}
          </button>
        ))
      }
    </>
  );
};

export default ThemeBtn;
