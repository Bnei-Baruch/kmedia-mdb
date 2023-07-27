import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import Basic from './Basic';
import Locale from './Locale';

const TopMost = ({ titlePostfix }) => (
  <Fragment>
    <Helmet defaultTitle={titlePostfix} titleTemplate={`%s | ${titlePostfix}`}>
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Kabbalah Media" />
    </Helmet>
    <Locale />
    <Basic />
  </Fragment>
);

TopMost.propTypes = {
  titlePostfix: PropTypes.string.isRequired,
};

export default TopMost;
