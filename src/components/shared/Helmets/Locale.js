import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import { getLanguageLocale } from '../../../helpers/i18n-utils';

class Locale extends Component {
  static propTypes = {
    mainLang: PropTypes.string.isRequired,
    alternateLang: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    alternateLang: [],
  };

  render() {
    const { mainLang, alternateLang } = this.props;

    return (
      <Helmet>
        {<meta property="og:locale" content={getLanguageLocale(mainLang)} />}
        {
          alternateLang
            .filter(x => x !== mainLang)
            .map(lang => <meta name="og:locale:alternate" content={getLanguageLocale(lang)} key={lang} />)
        }
      </Helmet>
    );
  }
}

export default Locale;
