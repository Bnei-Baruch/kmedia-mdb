import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox, Dropdown, List, Popup } from "semantic-ui-react";

import { useTranslation } from "react-i18next";
import { LANGUAGES, LANG_UI_LANGUAGES } from "../../helpers/consts";
import { updateHtmlLang } from "../../helpers/language";
import { backendApi } from "../../redux/api/backendApi";
import { wholeMusic } from "../../redux/api/music";
import { wholeSimpleMode } from "../../redux/api/simpleMode";
import { actions } from "../../redux/modules/settings";
import {
  settingsGetContentLanguagesSelector,
  settingsGetLeftRightByDirSelector,
  settingsGetShowAllContentSelector,
  settingsGetUIDirSelector,
  settingsGetUILangSelector,
  settingsGetUrlLangSelector,
} from "../../redux/selectors";
import Link from "../Language/MultiLanguageLink";
import LanguageItem from "./LanguageItem";
import LanguagesBtn from "./LanguagesBtn";
import LanguagesDropdown from "./LanguagesDropdown";

const HandleLanguages = () => {
  const { t } = useTranslation();

  const [isActive, setIsActive] = useState(false);
  const showAllContent = useSelector(settingsGetShowAllContentSelector);

  const urlLang = useSelector(settingsGetUrlLangSelector);
  const origUILang = useSelector((state) => settingsGetUILangSelector(state, true /* skipUrl */));
  const uiDir = useSelector(settingsGetUIDirSelector);
  const leftRight = useSelector(settingsGetLeftRightByDirSelector);
  const contentLanguages = useSelector((state) => settingsGetContentLanguagesSelector(state, true /* skipUrl */));
  const popupStyle = { direction: uiDir };
  const dispatch = useDispatch();

  console.log("HandleLanguages render", contentLanguages, urlLang, origUILang, uiDir, leftRight, showAllContent, isActive);

  const uiLanguageSelected = (language) => {
    updateHtmlLang(language);
    dispatch(actions.setUILanguage({ uiLang: language }));
    dispatch(backendApi.util.invalidateTags([wholeSimpleMode, wholeMusic]));
  };

  const addLanguage = (language) => {
    const newLanguages = contentLanguages.filter((lang) => lang !== language);
    newLanguages.push(language);
    dispatch(actions.setContentLanguages({ contentLanguages: newLanguages }));
    dispatch(backendApi.util.invalidateTags([wholeSimpleMode, wholeMusic]));
  };

  const setShowAllContent = () => dispatch(actions.setShowAllContent(!showAllContent));
  const handlePopup = useCallback(() => setIsActive(!isActive), [isActive]);

  return (
    <Popup
      id="handleLanguagesPopup"
      key="handleLangs"
      flowing
      position={`bottom ${leftRight}`}
      trigger={<LanguagesBtn handlePopup={handlePopup} />}
      open={isActive}
      onOpen={handlePopup}
      onClose={handlePopup}
      on="click"
      style={popupStyle}
    >
      <Popup.Content>
        {urlLang && (
          <div className="language-url">
            {t("languages.url_language_prefix", { lang: LANGUAGES[urlLang].name })}
            <Link language={origUILang}>{t("languages.url_language_here")}</Link>
            {t("languages.url_language_suffix")}
          </div>
        )}
        {
          <div className="language-ui">
            <h4 className={`margin-left-4 margin-right-4 ${!!urlLang ? "disabled" : ""}`}>
              {t("languages.ui_language")}
            </h4>
            <Dropdown disabled={!!urlLang} text={LANGUAGES[origUILang].name} item scrolling>
              <Dropdown.Menu>
                {LANG_UI_LANGUAGES.map((lang) => (
                  <Dropdown.Item
                    key={lang}
                    as={Link}
                    language={`${lang}`}
                    active={lang === origUILang}
                    onClick={() => uiLanguageSelected(lang)}
                  >
                    {LANGUAGES[lang].name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        }
        <h4 className="content-languages-title">{t("languages.content_languages")}</h4>
        <List celled>
          {contentLanguages.map((language, idx) => (
            <LanguageItem
              key={language}
              idx={idx}
              language={language}
              disabled={!!urlLang || contentLanguages.length === 1}
            />
          ))}
          <List.Item key="last" className="language-not-celled">
            <LanguagesDropdown
              disabled={!!urlLang}
              trigger={
                <Button disabled={!!urlLang} basic color="grey" size="small">
                  {t("languages.add_languages")}
                </Button>
              }
              selected={(lang) => addLanguage(lang)}
            />
          </List.Item>
        </List>
        <Checkbox
          className="language-checkbox"
          label={t("languages.show_all_content")}
          disabled={!!urlLang}
          checked={showAllContent}
          onChange={setShowAllContent}
        />
        <div className="language-subtext">{t("languages.show_all_content_explanation")}</div>
      </Popup.Content>
    </Popup>
  );
};

export default HandleLanguages;
