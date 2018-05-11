import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Flag, } from 'semantic-ui-react';

import { COOKIE_UI_LANG, LANG_UI_LANGUAGES, LANGUAGES } from '../../helpers/consts';
import Link from '../Language/MultiLanguageLink';
import { selectors as settings } from '../../redux/modules/settings';
import Helmets from '../shared/Helmets';

class UILanguage extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
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
    const { t, language } = this.props;

    return (
      <Fragment>
        <Helmets.TopMost
          titlePostfix={t('nav.top.header')}
          mainLang={language}
          alternateLang={LANG_UI_LANGUAGES}
        />
        <Dropdown item text={t(`constants.languages.${language}`)}>
          <Dropdown.Menu>
            {
              LANG_UI_LANGUAGES.map(x => (
                <Dropdown.Item key={x} as={Link} onClick={() => this.storeUILanguage(x)} language={x}>
                  <Flag name={LANGUAGES[x].flag} />
                  {t(`constants.languages.${x}`)}
                </Dropdown.Item>
              ))
            }
          </Dropdown.Menu>
        </Dropdown>
      </Fragment>
    );
  }
}

export default connect(
  state => ({
    language: settings.getLanguage(state.settings),
  })
)(UILanguage);
