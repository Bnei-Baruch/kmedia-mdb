import React from 'react';
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
            className={`flex-1 px-4 py-2 text-center ${d === fontType ? 'bg-blue-50 font-semibold' : ''}`}
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
