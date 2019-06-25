import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Dropdown, Flag, Menu } from 'semantic-ui-react';

import { COOKIE_CONTENT_LANG, LANGUAGES, ALL_LANGUAGES } from '../../helpers/consts';
import { expires } from '../../helpers/date';
import { getToWithLanguage } from '../../helpers/url';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';

class ContentLanguage extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    setContentLanguage: PropTypes.func.isRequired,
    // We need dependency on location in order to change Link every time url changes
    location: shapes.HistoryLocation.isRequired,
    t: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
  };

  storeContentLanguage = (language) => {
    if (language === '' || language === undefined) {
      return;
    }

    document.cookie = `${COOKIE_CONTENT_LANG}=${language}; path=/; expires=${expires}`;
    this.props.setContentLanguage(language);
  };

  onMobileChange = (e) => {
    const selectedContentLang = e.currentTarget.value;
    const { language, push, location } = this.props;

    this.storeContentLanguage(selectedContentLang);

    const link = getToWithLanguage(null, location, language, selectedContentLang);
    push(link);
  }

  render() {
    const { t, language, contentLanguage, isMobile } = this.props;

    return (
      <Menu secondary>
        <Menu.Item header>
          {t('languages.content_language')}
          :
        </Menu.Item>
        <Menu.Menu position="right">
          {
            isMobile
              ? 
              <select className="dropdown-container" value={contentLanguage} onChange={this.onMobileChange} >
                {
                  ALL_LANGUAGES.map(x => (
                    <option key={`opt-${x}`} value={x}>
                      {t(`constants.languages.${x}`)}
                    </option>
                  ))
                }
              </select>
              : 
              <Dropdown item scrolling text={`${t(`constants.languages.${contentLanguage}`)}`}>
                <Dropdown.Menu>
                  {
                    ALL_LANGUAGES.map(x => (
                      <Dropdown.Item
                        key={x}
                        as={Link}
                        active={x === contentLanguage}
                        onClick={() => this.storeContentLanguage(x)}
                        language={language}
                        contentLanguage={x}
                      >
                        <Flag name={LANGUAGES[x].flag} />
                        {t(`constants.languages.${x}`)}
                      </Dropdown.Item>
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
          }
        </Menu.Menu>
      </Menu>
    );
  }
}

export default withNamespaces()(ContentLanguage);
