import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

class NoIndex extends Component {
  render() {
    return (
      <Helmet>
        <meta property="robots" content="noindex" />
      </Helmet>
    );
  }
}

export default NoIndex;
