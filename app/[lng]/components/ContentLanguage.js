import React, { useContext, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { Dropdown, Menu } from 'semantic-ui-react';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors as settings } from '../../../lib/redux/slices/settingsSlice/settingsSlice';
import { ALL_LANGUAGES, COOKIE_CONTENT_LANG, LANGUAGES, LANG_ORIGINAL } from '../../../src/helpers/consts';
import { setCookie } from '../../../src/helpers/date';
import { getToWithLanguage } from '../../../src/helpers/url';
import Link from '../../../src/components/Language/MultiLanguageLink';
import { DeviceInfoContext } from '../../../src/helpers/app-contexts';

const storeContentLanguage = (language, setContentLanguage) => {
  if (!language) {
    return;
  }

  setCookie(COOKIE_CONTENT_LANG, language);
  setContentLanguage(language);
};

const DesktopLanguage = ({ language, contentLanguage, setContentLanguage }) => (
  <Dropdown item scrolling text={LANGUAGES[contentLanguage].name}>
    <Dropdown.Menu>
      {
        ALL_LANGUAGES
          .filter(x => x !== LANG_ORIGINAL)
          .map(lang =>
            <Dropdown.Item
              key={lang}
              as={Link}
              active={lang === contentLanguage}
              onClick={() => storeContentLanguage(lang, setContentLanguage)}
              language={language}
              contentLanguage={lang}
            >
              {LANGUAGES[lang].name}
            </Dropdown.Item>
          )
      }
    </Dropdown.Menu>
  </Dropdown>
);

const MobileLanguage = ({ language, contentLanguage, setContentLanguage }) => {
// We need dependency on location in order to change Link every time url changes
  const navigate = useNavigate();
  const location = useLocation();

  const onMobileChange = (e, language, setContentLanguage) => {
    const selectedContentLang = e.currentTarget.value;
    storeContentLanguage(selectedContentLang, setContentLanguage);

    const link = getToWithLanguage(null, location, language, selectedContentLang);
    navigate(link);
  };

  return (
    <select
      className="dropdown-container"
      value={contentLanguage}
      onChange={e => onMobileChange(e, language, setContentLanguage)}
    >
      {
        ALL_LANGUAGES
          .filter(x => x !== LANG_ORIGINAL)
          .map(x =>
            <option key={`opt-${x}`} value={x}>
              {LANGUAGES[x].name}
            </option>)
      }
    </select>
  );
};

const ContentLanguage = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const language           = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage    = useSelector(state => settings.getContentLanguage(state.settings));

  const { t }              = useTranslation();
  const dispatch           = useDispatch();
  const setContentLanguage = useCallback(cLang => dispatch(actions.setContentLanguage(cLang)), [dispatch]);

  return (
    <Menu secondary>
      <Menu.Item header>
        {t('languages.content_language')}
        :
      </Menu.Item>
      <Menu.Menu position="right">
        {
          isMobileDevice
            ?
            <MobileLanguage
              language={language}
              contentLanguage={contentLanguage}
              setContentLanguage={setContentLanguage}
            />
            :
            <DesktopLanguage
              language={language}
              contentLanguage={contentLanguage}
              setContentLanguage={setContentLanguage}
              storeContentLanguage={storeContentLanguage}
            />
        }
      </Menu.Menu>
    </Menu>
  );
};

export default ContentLanguage;
