import React from 'react';
import { Helmet } from 'react-helmet-async';

const NoIndex = () => (
  <Helmet>
    <meta property="robots" content="noindex" />
  </Helmet>
);

export default NoIndex;
