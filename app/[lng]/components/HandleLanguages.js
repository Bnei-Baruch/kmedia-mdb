import React, { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Checkbox, Dropdown, Icon, List, Popup } from 'semantic-ui-react';

import { ALL_LANGUAGES, LANGUAGES, LANG_UI_LANGUAGES } from '../../../src/helpers/consts';
import { DeviceInfoContext } from '../../../src/helpers/app-contexts';

import { selectors as settings, actions } from '../../../lib/redux/slices/settingsSlice/settingsSlice';
import Link from '../../../src/components/Language/MultiLanguageLink';
import { useTranslation } from '../../i18n/client';

const eqSet = (xs, ys) => xs.size === ys.size && [...xs].every(x => ys.has(x));

const HandleLanguages = () => {
  const [isActive, setIsActive] = useState(false);
  const { isMobileDevice }      = useContext(DeviceInfoContext);
  const showAllContent          = useSelector(state => settings.getShowAllContent(state.settings));

  const urlLang          = useSelector(state => settings.getUrlLang(state.settings));
  const { t }            = useTranslation(urlLang);
  const origUILang       = useSelector(state => settings.getUILang(state.settings, true /* skipUrl */));
  const uiDir            = useSelector(state => settings.getUIDir(state.settings));
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings, true /* skipUrl */));
  const popupStyle       = { direction: uiDir };
  const dispatch         = useDispatch();

  const uiLanguageSelected = language => {
    dispatch(actions.setUILanguage({ uiLang: language }));
  };

  const addLanguage = language => {
    const newLanguages = contentLanguages.filter((lang) => lang !== language);
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

  const Trigger = React.forwardRef(({ t }, ref) => (
    <div onClick={handlePopup} ref={ref}>
      {
        isMobileDevice
          ? <Icon size="big" name="language" className="no-margin" />
          : (
            <div className="language-trigger">
              {urlLang && <Icon name="unlink" />}
              {!urlLang && <Icon name="sliders horizontal" />}
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
        <Icon disabled={!!urlLang} className="language-trigger" name="close" onClick={lang => removeLanguage(idx)} />
      </div>
    </List.Item>
  );

  return (
    <Popup
      id="handleLanguagesPopup"
      key="handleLangs"
      flowing
      position={`bottom ${uiDir === 'rtl' ? 'left' : 'right'}`}
      trigger={<Trigger t={t} />}
      open={isActive}
      onOpen={handlePopup}
      onClose={handlePopup}
      on="click"
      style={popupStyle}
    >
      <Popup.Content>
        {urlLang && <div className="language-url">You are using {LANGUAGES[urlLang].name} from URL,
          click <Link language={origUILang}>here</Link> to use your languages.</div>}
        {<div className="language-ui">
          <h4 className={!!urlLang ? 'disabled' : ''}>UI language:</h4>
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
        <h4 className="content-languages-title">Content Languages</h4>
        <List celled>
          {contentLanguages.map((language, idx) => languageItem(idx, language, !!urlLang))}
          <List.Item key="last" className="language-not-celled">
            <LanguagesDropdown
              disabled={!!urlLang}
              allLanguages={ALL_LANGUAGES}
              trigger={<Button disabled={!!urlLang} basic color="grey" size="small">Add language...</Button>}
              selected={lang => addLanguage(lang)} />
          </List.Item>
        </List>
        <Checkbox
          className="language-checkbox"
          label="Show all content"
          disabled={!!urlLang}
          checked={showAllContent}
          onChange={() => setShowAllContent()} />
        <div className="language-subtext">You will see content in other languages too.</div>
      </Popup.Content>
    </Popup>
  );
};

export default HandleLanguages;
