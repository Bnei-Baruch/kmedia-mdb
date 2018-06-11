import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import Basic from './Basic';
import Locale from './Locale';

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
    const { titlePostfix } = this.props;

    const titleTemplate = `%s | ${titlePostfix}`;

    return (
      <div>
        <Helmet defaultTitle={titlePostfix} titleTemplate={titleTemplate}>
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Kabbalah Media" />
        </Helmet>
        <Locale {...this.props} />
        <Basic />
      </div>
    );
  }
}

export default TopMost;
