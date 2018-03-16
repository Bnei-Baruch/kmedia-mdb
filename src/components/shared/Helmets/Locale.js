import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { LANGUAGE_TO_LOCALE } from '../../../helpers/consts';

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
        {<meta property="og:locale" content={mainLang} />}
        {alternateLang.map((lang, index) =>
          <meta name="og:locale:alternate" content={LANGUAGE_TO_LOCALE[lang]} key={index} />)}

      </Helmet>
    );
  }
}

export default Locale;
