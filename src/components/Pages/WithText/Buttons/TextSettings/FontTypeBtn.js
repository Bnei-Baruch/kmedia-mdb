import React from 'react';
import { Menu } from 'semantic-ui-react';
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
          <Menu.Item
            key={d}
            onClick={() => handleSet(d)}
            active={d === fontType}
            content={d}
            disabled={isPdf}
          />
        ))
      }
    </>
  );
};

export default FontTypeBtn;
