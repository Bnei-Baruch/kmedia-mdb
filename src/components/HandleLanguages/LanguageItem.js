import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, List } from "semantic-ui-react";
import { LANGUAGES } from "../../helpers/consts";
import { backendApi } from "../../redux/api/backendApi";
import { actions } from "../../redux/modules/settings";
import { settingsGetContentLanguagesSelector, settingsGetUrlLangSelector } from "../../redux/selectors";



const LanguageItem = (idx, language, disabled) => {
  const urlLang = useSelector(settingsGetUrlLangSelector);
  const contentLanguages = useSelector((state) => settingsGetContentLanguagesSelector(state, true /* skipUrl */));
  const dispatch = useDispatch();

  const removeLanguage = (idx) => {
    const newLanguages = contentLanguages.slice();
    newLanguages.splice(idx, 1);
    dispatch(actions.setContentLanguages({ contentLanguages: newLanguages }));
    dispatch(backendApi.util.invalidateTags([wholeSimpleMode, wholeMusic]));
  };

  return (
    <List.Item key={language}>
      <div className="language-item">
        <div className={disabled ? "disabled" : ""}>
          <div>
            {idx + 1}. {LANGUAGES[language].name}
          </div>
        </div>
        <Icon
          disabled={!!urlLang || disabled}
          className="language-trigger"
          name="close"
          onClick={(lang) => removeLanguage(idx)}
        />
      </div>
    </List.Item>
  );
};

export default LanguageItem;
