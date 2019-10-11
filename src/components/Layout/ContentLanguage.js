import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Dropdown, Flag, Menu } from 'semantic-ui-react';

import { COOKIE_CONTENT_LANG, LANGUAGES, ALL_LANGUAGES } from '../../helpers/consts';
import { yearFromNow } from '../../helpers/date';
import { getToWithLanguage } from '../../helpers/url';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';


const storeContentLanguage = (language, setContentLanguage) => {
  if (!language){
    return;
  }

  document.cookie = `${COOKIE_CONTENT_LANG}=${language}; path=/; expires=${yearFromNow}`;
  setContentLanguage(language);
};


const onMobileChange = (e, language, location, push, setContentLanguage) => {
  const selectedContentLang = e.currentTarget.value;

  storeContentLanguage(selectedContentLang, setContentLanguage);

  const link = getToWithLanguage(null, location, language, selectedContentLang);
  push(link);
}

const DesktopLanguage = ({language, contentLanguage, setContentLanguage, t}) => (
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
)

const MobileLanguage = ({language, contentLanguage, location, push, t, setContentLanguage}) => (
  <select 
    className="dropdown-container" 
    value={contentLanguage} 
    onChange={e => onMobileChange(e, language, location, push, setContentLanguage) }
  >
    {
      ALL_LANGUAGES.map(x => 
        <option key={`opt-${x}`} value={x}>
          {t(`constants.languages.${x}`)}
        </option>)
    }
  </select>
)

const ContentLanguage = ({ language, contentLanguage, setContentLanguage, isMobile, location, push, t }) => (
  <Menu secondary>
    <Menu.Item header>
      {t('languages.content_language')}
          :
    </Menu.Item>
    <Menu.Menu position="right">
      {
        isMobile
          ? 
          <MobileLanguage 
            language={language} 
            contentLanguage={contentLanguage} 
            setContentLanguage={setContentLanguage}
            location={location}
            push={push}
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

ContentLanguage.propTypes = {
  language: PropTypes.string.isRequired,
  contentLanguage: PropTypes.string.isRequired,
  setContentLanguage: PropTypes.func.isRequired,
  // We need dependency on location in order to change Link every time url changes
  location: shapes.HistoryLocation.isRequired,
  t: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  push: PropTypes.func.isRequired,
};

export default withNamespaces()(ContentLanguage);



