import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Dropdown, Flag, Menu } from 'semantic-ui-react';

import { COOKIE_UI_LANG, LANG_UI_LANGUAGES, LANGUAGES } from '../../helpers/consts';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';

class UILanguage extends Component {
  static propTypes = {
    contentLanguage: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,

    // We need dependency on location in order to change Link every time url changes
    location: shapes.HistoryLocation.isRequired,
    t: PropTypes.func.isRequired,
  };

  storeUILanguage = (language) => {
    if (language === '' || language === undefined) {
      return;
    }
    const expires   = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toUTCString();
    document.cookie = `${COOKIE_UI_LANG}=${language}; path=/; expires=${expires}`;
  };

  render() {
    const { t, language, contentLanguage } = this.props;

    return (
      <Menu secondary>
        <Menu.Item header>
          {t('languages.website_language')}
          :
        </Menu.Item>
        <Menu.Menu position="right">
          <Dropdown item text={`${t(`constants.languages.${language}`)}`}>
            <Dropdown.Menu>
              {
                LANG_UI_LANGUAGES.map(x => (
                  <Dropdown.Item
                    key={x}
                    as={Link}
                    language={`${x}`}
                    contentLanguage={contentLanguage}
                    onClick={() => this.storeUILanguage(x)}
                  >
                    <Flag name={LANGUAGES[x].flag} />
                    {t(`constants.languages.${x}`)}
                  </Dropdown.Item>
                ))
              }
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default withNamespaces()(UILanguage);
