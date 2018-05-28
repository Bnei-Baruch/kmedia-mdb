import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Flag, } from 'semantic-ui-react';

import { COOKIE_CONTENT_LANG, LANGUAGES } from '../../helpers/consts';
import Link from '../Language/MultiLanguageLink';
import { selectors as settings } from '../../redux/modules/settings';

class ContentLanguage extends Component {
  static propTypes = {
    contentLanguage: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  storeUILanguage = (language) => {
    if (language === '' || language === undefined) {
      return;
    }
    const expires   = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toUTCString();
    document.cookie = `${COOKIE_CONTENT_LANG}=${language}; path=/; expires=${expires}`;
  };

  render() {
    const { t, contentLanguage } = this.props;

    return (
      <Dropdown item scrolling text={t(`constants.languages.${contentLanguage}`)}>
        <Dropdown.Menu>
          {
            Object.values(LANGUAGES).map(({ value: x, flag, name = t(`constants.languages.${x}`) }) => (
              <Dropdown.Item key={x} as={Link} onClick={() => this.storeUILanguage(x)} language={`${x}`}>
                <Flag name={flag} />
                {name}
              </Dropdown.Item>
            ))
          }
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default connect(
  state => ({
    contentLanguage: settings.getContentLanguage(state.settings),
  })
)(ContentLanguage);
