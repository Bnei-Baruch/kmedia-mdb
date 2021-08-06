import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import Basic from './Basic';
import Locale from './Locale';

const TopMost = props => {
  const { titlePostfix } = props;
  const titleTemplate    = `%s | ${titlePostfix}`;

  return (
    <Fragment>
      <Helmet defaultTitle={titlePostfix} titleTemplate={titleTemplate}>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Kabbalah Media" />
      </Helmet>
      <Locale {...props} />
      <Basic />
    </Fragment>
  );
};

TopMost.propTypes = {
  titlePostfix: PropTypes.string.isRequired,
  mainLang: PropTypes.string.isRequired,
};

export default TopMost;
