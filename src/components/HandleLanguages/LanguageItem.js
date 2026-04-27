import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LANGUAGES } from '../../helpers/consts';
import { backendApi } from '../../redux/api/backendApi';
import { wholeMusic } from '../../redux/api/music';
import { wholeSimpleMode } from '../../redux/api/simpleMode';
import { actions } from '../../redux/modules/settings';
import { settingsGetContentLanguagesSelector, settingsGetUrlLangSelector } from '../../redux/selectors';

const LanguageItem = (idx, language, disabled) => {
  const urlLang = useSelector(settingsGetUrlLangSelector);
  const contentLanguages = useSelector(state => settingsGetContentLanguagesSelector(state, true /* skipUrl */));
  const dispatch = useDispatch();

  const removeLanguage = idx => {
    const newLanguages = contentLanguages.slice();
    newLanguages.splice(idx, 1);
    dispatch(actions.setContentLanguages({ contentLanguages: newLanguages }));
    dispatch(backendApi.util.invalidateTags([wholeSimpleMode, wholeMusic]));
  };

  return (
    <li key={language}>
      <div className="language-item">
        <div className={disabled ? 'disabled' : ''}>
          <div>
            {idx + 1}. {LANGUAGES[language].name}
          </div>
        </div>
        <span
          className={`material-symbols-outlined language-trigger cursor-pointer ${(!!urlLang || disabled) ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => removeLanguage(idx)}
        >
          close
        </span>
      </div>
    </li>
  );
};

export default LanguageItem;
