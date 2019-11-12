import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Dropdown, Flag, Menu } from 'semantic-ui-react';

import { COOKIE_UI_LANG, LANG_UI_LANGUAGES, LANGUAGES } from '../../helpers/consts';
import { setCookie } from '../../helpers/date';
import { getToWithLanguage } from '../../helpers/url';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import { DeviceInfoContext } from "../../helpers/app-contexts";

const storeUILanguage = (language) => {
  if (!language) {
    return;
  }

  setCookie(COOKIE_UI_LANG, language);
};

const onMobileChange = (e, contentLanguage, location, push) => {
  const selectedLang = e.currentTarget.value;
  storeUILanguage(selectedLang);

  const link = getToWithLanguage(null, location, selectedLang, contentLanguage);
  push(link);
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

const MobileLanguage = ({ language, contentLanguage, location, push, t }) => (
  <select
    className="dropdown-container"
    value={language}
    onChange={e => onMobileChange(e, contentLanguage, location, push)}
  >
    {
      LANG_UI_LANGUAGES.map(x =>
        <option key={`opt-${x}`} value={x}>
          {t(`constants.languages.${x}`)}
        </option>)
    }
  </select>
);

const UILanguage = ({ language, contentLanguage, isMobile, location, push, t }) => {
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
	          ?
	          <MobileLanguage
	            language={language}
	            onMobileChange={onMobileChange}
	            contentLanguage={contentLanguage}
	            location={location}
	            push={push}
	            t={t} />
	          : <DesktopLanguage t={t} language={language} contentLanguage={contentLanguage} />
	      }
	    </Menu.Menu>
	  </Menu>
	);
};

UILanguage.propTypes = {
  contentLanguage: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,

  // We need dependency on location in order to change Link every time url changes
  location: shapes.HistoryLocation.isRequired,
  t: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
};

export default withNamespaces()(UILanguage);
