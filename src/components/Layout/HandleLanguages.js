import React, { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, Checkbox, Dropdown, Icon, List, Popup } from 'semantic-ui-react';

import { ALL_LANGUAGES, LANGUAGES, LANG_UI_LANGUAGES } from '../../helpers/consts';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { updateHtmlLang } from '../../helpers/language';

import { actions } from '../../redux/modules/settings';
import Link from '../Language/MultiLanguageLink';
import {
  settingsGetContentLanguagesSelector,
  settingsGetShowAllContentSelector,
  settingsGetUIDirSelector,
  settingsGetUILangSelector,
  settingsGetUrlLangSelector
} from '../../redux/selectors';

const HandleLanguages = ({ t }) => {
  const [isActive, setIsActive] = useState(false);
  const { isMobileDevice }      = useContext(DeviceInfoContext);
  const showAllContent          = useSelector(settingsGetShowAllContentSelector);

  const urlLang          = useSelector(settingsGetUrlLangSelector);
  const origUILang       = useSelector(state => settingsGetUILangSelector(state, true /* skipUrl */));
  const uiDir            = useSelector(settingsGetUIDirSelector);
  const contentLanguages = useSelector(state => settingsGetContentLanguagesSelector(state, true /* skipUrl */));
  const popupStyle       = { direction: uiDir };
  const dispatch         = useDispatch();

  const uiLanguageSelected = language => {
    updateHtmlLang(language);
    dispatch(actions.setUILanguage({ uiLang: language }));
  };

  const addLanguage = language => {
    const newLanguages = contentLanguages.filter(lang => lang !== language);
    newLanguages.push(language);
    dispatch(actions.setContentLanguages({ contentLanguages: newLanguages }));
  };

  const removeLanguage = idx => {
    const newLanguages = contentLanguages.slice();
    newLanguages.splice(idx, 1);
    dispatch(actions.setContentLanguages({ contentLanguages: newLanguages }));
  };

  const setShowAllContent = () => dispatch(actions.setShowAllContent(!showAllContent));
  const handlePopup       = () => setIsActive(!isActive);

  const Trigger = React.forwardRef((props, ref) => (
    <div onClick={handlePopup} ref={ref}>
      {
        isMobileDevice
          ? <Icon size="big" name="language" className="no-margin"/>
          : (
            <div className="language-trigger">
              {urlLang && <Icon name="unlink"/>}
              {!urlLang && <Icon name="sliders horizontal"/>}
              {t('languages.language')}
            </div>
          )
      }
    </div>
  ));

  const LanguagesDropdown = ({ disabled, allLanguages, trigger, language, selected, asLink }) => (
    <Dropdown disabled={disabled} item scrolling trigger={trigger} icon={trigger ? null : 'dropdown'}>
      <Dropdown.Menu>
        {
          allLanguages.map(lang =>
            <Dropdown.Item
              key={lang}
              as={asLink ? Link : undefined}
              language={`${lang}`}
              active={lang === language}
              onClick={() => selected(lang)}
            >
              {LANGUAGES[lang].name}
            </Dropdown.Item>
          )
        }
      </Dropdown.Menu>
    </Dropdown>
  );

  const languageItem = (idx, language, disabled) => (
    <List.Item key={language}>
      <div className="language-item">
        <div className={disabled ? 'disabled' : ''}>
          <div>{idx + 1}. {LANGUAGES[language].name}</div>
        </div>
        <Icon disabled={!!urlLang || disabled} className="language-trigger" name="close" onClick={lang => removeLanguage(idx)}/>
      </div>
    </List.Item>
  );

  return (
    <Popup
      id="handleLanguagesPopup"
      key="handleLangs"
      flowing
      position={`bottom ${uiDir === 'rtl' ? 'left' : 'right'}`}
      trigger={<Trigger/>}
      open={isActive}
      onOpen={handlePopup}
      onClose={handlePopup}
      on="click"
      style={popupStyle}
    >
      <Popup.Content>
        {urlLang && <div className="language-url">
          {t('languages.url_language_prefix', { lang: LANGUAGES[urlLang].name })}
          <Link language={origUILang}>{t('languages.url_language_here')}</Link>
          {t('languages.url_language_suffix')}</div>}
        {<div className="language-ui">
          <h4 className={!!urlLang ? 'disabled' : ''}>{t('languages.ui_language')}</h4>
          <Dropdown disabled={!!urlLang} text={LANGUAGES[origUILang].name} item scrolling>
            <Dropdown.Menu>
              {
                LANG_UI_LANGUAGES.map(lang =>
                  <Dropdown.Item
                    key={lang}
                    as={Link}
                    language={`${lang}`}
                    active={lang === origUILang}
                    onClick={() => uiLanguageSelected(lang)}
                  >
                    {LANGUAGES[lang].name}
                  </Dropdown.Item>
                )
              }
            </Dropdown.Menu>
          </Dropdown>
        </div>}
        <h4 className="content-languages-title">{t('languages.content_languages')}</h4>
        <List celled>
          {contentLanguages.map((language, idx) => languageItem(idx, language, !!urlLang || contentLanguages.length === 1))}
          <List.Item key="last" className="language-not-celled">
            <LanguagesDropdown
              disabled={!!urlLang}
              allLanguages={ALL_LANGUAGES}
              trigger={<Button disabled={!!urlLang} basic color="grey" size="small">{t('languages.add_languages')}</Button>}
              selected={lang => addLanguage(lang)}/>
          </List.Item>
        </List>
        <Checkbox
          className="language-checkbox"
          label={t('languages.show_all_content')}
          disabled={!!urlLang}
          checked={showAllContent}
          onChange={() => setShowAllContent()}/>
        <div className="language-subtext">{t('languages.show_all_content_explanation')}</div>
      </Popup.Content>
    </Popup>
  );
};

HandleLanguages.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation()(HandleLanguages);
