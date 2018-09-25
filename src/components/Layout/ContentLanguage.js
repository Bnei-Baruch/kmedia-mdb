import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Flag, Menu} from 'semantic-ui-react';

import { COOKIE_CONTENT_LANG, LANGUAGES } from '../../helpers/consts';
import Link from '../Language/MultiLanguageLink';

class ContentLanguage extends Component {
  static propTypes = {
    contentLanguage: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    setContentLanguage: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  storeContentLanguage = (language) => {
    const expires   = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toUTCString();
    document.cookie = `${COOKIE_CONTENT_LANG}=${language}; path=/; expires=${expires}`;
    this.props.setContentLanguage(language);
  };

  render() {
    const { t, language, contentLanguage } = this.props;

    return (
      <Menu secondary>
        <Menu.Item header>Prefered content language:</Menu.Item>
        <Menu.Menu position='right'>
          <Dropdown item scrolling text={`${t(`constants.languages.${contentLanguage}`)}`}>
            <Dropdown.Menu >
              {
                Object.values(LANGUAGES).map(({ value: x, flag, name = t(`constants.languages.${x}`) }) => (
                  <Dropdown.Item
                    key={x}
                    as={Link}
                    active={x === contentLanguage}
                    onClick={() => {
                      this.storeContentLanguage(x);
                    }}
                    language={language}
                    contentLanguage={x}
                  >
                    <Flag name={flag} />
                    {name}
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

export default ContentLanguage;
