import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../../redux/modules/textPage';
import { textPageGetSettings, textPageGetFileSelector } from '../../../../../redux/selectors';

const FONT_SERIF      = 'serif';
const FONT_SANS_SERIF = 'sans-serif';
const btns            = [FONT_SERIF, FONT_SANS_SERIF];

const FontTypeBtn = () => {
  const { fontType } = useSelector(textPageGetSettings);
  const { isPdf }    = useSelector(textPageGetFileSelector);

  const dispatch  = useDispatch();
  const handleSet = d => dispatch(actions.setFontType(d));

  return (
    <>
      {
        btns.map(d => (
          <button
            key={d}
            onClick={() => handleSet(d)}
            className={`flex-1 min-w-0 px-4 py-[14.86px] leading-none text-center capitalize whitespace-nowrap ${d === fontType ? 'bg-black/5' : 'hover:bg-black/3'}`}
            disabled={isPdf}
          >
            {d}
          </button>
        ))
      }
    </>
  );
};

export default FontTypeBtn;
