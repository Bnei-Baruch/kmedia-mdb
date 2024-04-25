import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import { actions } from '../../../../../redux/modules/textPage';
import { textPageGetAdditionsModeSelector } from '../../../../../redux/selectors';
import { TEXT_PAGE_ADDITIONS_MODS, LOCALSTORAGE_KEY_ADDITIONS_MODS } from '../../../../../helpers/consts';

const iconsByMode = {
  [TEXT_PAGE_ADDITIONS_MODS.showMy] : 'person',
  [TEXT_PAGE_ADDITIONS_MODS.showAll]: 'group',
  [TEXT_PAGE_ADDITIONS_MODS.hideAll]: 'visibility_off',
};

const AdditionsModeItems = () => {
  const { t }    = useTranslation();
  const dispatch = useDispatch();

  const mode = useSelector(textPageGetAdditionsModeSelector);

  useEffect(() => {
    if (!mode) {
      let m = parseInt(localStorage.getItem(LOCALSTORAGE_KEY_ADDITIONS_MODS));
      m     = isNaN(m) ? TEXT_PAGE_ADDITIONS_MODS.showMy : m;
      dispatch(actions.setAdditionsMode(m));
    }
  }, [mode]);

  const handleSet = m => dispatch(actions.setAdditionsMode(m));

  return (
    <Menu vertical fluid className="additions_mode_popup">
      {
        Object
          .entries(TEXT_PAGE_ADDITIONS_MODS)
          .map(([key, val]) => (
            <Menu.Item
              onClick={() => handleSet(val)}
              active={mode === val}
            >
              {t(`page-with-text.buttons.web.additions.${key}`)}
              <span className="material-symbols-outlined">{iconsByMode[val]}</span>
            </Menu.Item>
          )
          )
      }
    </Menu>
  );
};

export default AdditionsModeItems;
