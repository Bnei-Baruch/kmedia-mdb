import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Basic from './Basic';
import { LANGUAGE_TO_LOCALE } from '../../../helpers/consts';

class TopMost extends Component {
  static propTypes = {
    titlePostfix: PropTypes.string.isRequired,
    mainLang: PropTypes.string.isRequired,
    alternateLang: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    alternateLang: [],
  };

  render() {
    const { titlePostfix, mainLang, alternateLang } = this.props;

    const titleTemplate = `%s | ${titlePostfix}`;

    return (
      <div>
        <Helmet defaultTitle={titlePostfix} titleTemplate={titleTemplate}>
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Kabbalah Media" />

          {/*TODO (orin): <link rel="canonical" href="">*/}
          <meta property="og:locale" content={LANGUAGE_TO_LOCALE[mainLang]} />
          {alternateLang.map((lang, index) =>
            <meta name="og:locale:alternate" content={LANGUAGE_TO_LOCALE[lang]} key={index} />)}
        </Helmet>
        <Basic />
      </div>
    );
  }
}

export default TopMost;
