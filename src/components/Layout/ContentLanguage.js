import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Dropdown, Flag, Menu } from 'semantic-ui-react';
import { useHistory, useLocation } from 'react-router';

import { ALL_LANGUAGES, COOKIE_CONTENT_LANG, LANGUAGES } from '../../helpers/consts';
import { setCookie } from '../../helpers/date';
import { getToWithLanguage } from '../../helpers/url';
import Link from '../Language/MultiLanguageLink';
import { DeviceInfoContext } from "../../helpers/app-contexts";

const storeContentLanguage = (language, setContentLanguage) => {
  if (!language) {
    return;
  }

  setCookie(COOKIE_CONTENT_LANG, language);
  setContentLanguage(language);
};


const DesktopLanguage = ({ language, contentLanguage, setContentLanguage, t }) => (
  <Dropdown item scrolling text={`${t(`constants.languages.${contentLanguage}`)}`}>
    <Dropdown.Menu>
      {
        ALL_LANGUAGES.map(x =>
          <Dropdown.Item
            key={x}
            as={Link}
            active={x === contentLanguage}
            onClick={() => storeContentLanguage(x, setContentLanguage)}
            language={language}
            contentLanguage={x}
          >
            <Flag name={LANGUAGES[x].flag} />
            {t(`constants.languages.${x}`)}
          </Dropdown.Item>
        )
      }
    </Dropdown.Menu>
  </Dropdown>
);

const MobileLanguage = ({ language, contentLanguage, t, setContentLanguage }) => {
// We need dependency on location in order to change Link every time url changes
  const history = useHistory();
  const location = useLocation();

  const onMobileChange = (e, language, setContentLanguage) => {
    const selectedContentLang = e.currentTarget.value;
    storeContentLanguage(selectedContentLang, setContentLanguage);

    const link = getToWithLanguage(null, location, language, selectedContentLang);
    history.push(link);
  };

  return (
    <select
      className="dropdown-container"
      value={contentLanguage}
      onChange={e => onMobileChange(e, language, setContentLanguage)}
    >
      {
        ALL_LANGUAGES.map(x =>
          <option key={`opt-${x}`} value={x}>
            {t(`constants.languages.${x}`)}
          </option>)
      }
    </select>
  );
};

const ContentLanguage = ({ language, contentLanguage, setContentLanguage, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
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
              t={t} />
            :
            <DesktopLanguage
              language={language}
              contentLanguage={contentLanguage}
              t={t}
              setContentLanguage={setContentLanguage}
              storeContentLanguage={storeContentLanguage}
            />
        }
      </Menu.Menu>
    </Menu>
  );
};

ContentLanguage.propTypes = {
  language: PropTypes.string.isRequired,
  contentLanguage: PropTypes.string.isRequired,
  setContentLanguage: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(ContentLanguage);



