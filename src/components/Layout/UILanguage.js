import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Dropdown, Flag, Menu } from 'semantic-ui-react';
import { useHistory, useLocation } from 'react-router';

import { COOKIE_UI_LANG, LANG_UI_LANGUAGES, LANGUAGES } from '../../helpers/consts';
import { setCookie } from '../../helpers/date';
import { getToWithLanguage } from '../../helpers/url';
import Link from '../Language/MultiLanguageLink';
import { DeviceInfoContext } from '../../helpers/app-contexts';


const storeUILanguage = (language) => {
  if (!language) {
    return;
  }

  setCookie(COOKIE_UI_LANG, language);
};


const DesktopLanguage = ({ language, contentLanguage, t }) => (
  <Dropdown item text={t(`constants.languages.${language}`)}>
    <Dropdown.Menu>
      {
        LANG_UI_LANGUAGES.map(x =>
          <Dropdown.Item
            key={x}
            as={Link}
            language={`${x}`}
            active={x === language}
            contentLanguage={contentLanguage}
            onClick={() => storeUILanguage(x)}
          >
            <Flag name={LANGUAGES[x].flag} />
            {t(`constants.languages.${x}`)}
          </Dropdown.Item>
        )
      }
    </Dropdown.Menu>
  </Dropdown>
);

const MobileLanguage = ({ language, contentLanguage, t }) => {
  // We need dependency on location in order to change Link every time url changes
  const history = useHistory();
  const location = useLocation();

  const onMobileChange = (e, contentLanguage) => {
    const selectedLang = e.currentTarget.value;
    storeUILanguage(selectedLang);

    const link = getToWithLanguage(null, location, selectedLang, contentLanguage);
    history.push(link);
  };

  return (
    <select
      className="dropdown-container"
      value={language}
      onChange={e => onMobileChange(e, contentLanguage)}
    >
      {
        LANG_UI_LANGUAGES.map(x =>
          <option key={`opt-${x}`} value={x}>
            {t(`constants.languages.${x}`)}
          </option>)
      }
    </select>
  );
};

const UILanguage = ({ language, contentLanguage, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  return (
    <Menu secondary>
      <Menu.Item header>
        {t('languages.website_language')}
        :
      </Menu.Item>
      <Menu.Menu position="right">
        {
          isMobileDevice
            ? <MobileLanguage language={language} contentLanguage={contentLanguage} t={t} />
            : <DesktopLanguage language={language} contentLanguage={contentLanguage} t={t} />
        }
      </Menu.Menu>
    </Menu>
  );
};

UILanguage.propTypes = {
  contentLanguage: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(UILanguage);
