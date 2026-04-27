import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { LOCALSTORAGE_KEY_ADDITIONS_MODS, TEXT_PAGE_ADDITIONS_MODS } from '../../../../../helpers/consts';
import { actions } from '../../../../../redux/modules/textPage';
import { textPageGetAdditionsModeSelector } from '../../../../../redux/selectors';

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
    <nav className="additions_mode_popup flex flex-col">
      {
        Object
          .entries(TEXT_PAGE_ADDITIONS_MODS)
          .map(([key, val]) => (
            <button
              onClick={() => handleSet(val)}
              className={`flex items-center justify-between px-4 py-2 text-left ${mode === val ? 'bg-blue-50 font-semibold' : ''}`}
              key={key}
            >
              {t(`page-with-text.buttons.web.additions.${key}`)}
              <span className="material-symbols-outlined">{iconsByMode[val]}</span>
            </button>
          )
          )
      }
    </nav>
  );
};

export default AdditionsModeItems;
