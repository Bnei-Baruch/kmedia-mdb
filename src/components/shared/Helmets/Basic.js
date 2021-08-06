import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import { isEmpty, publicFile } from '../../../helpers/utils';
import Image from './Image';

const buildTitle = title => (
  <Helmet>
    <title>{title}</title>
    {/* Open Graph */}
    <meta property="og:title" content={title} />
    {/* Schema.org */}
    {/* <meta itemProp="name" content={title} /> */}
  </Helmet>
);

const buildDescription = description => (
  <Helmet>
    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
    {/* <meta itemProp="description" content={description} /> */}
    {/* <meta name="twitter:description" content={description} /> */}
  </Helmet>
);

const Basic = props => {
  const { title = null, description = null, keywords = null, /* url = null, */ imageUrl = publicFile('seo/default2.png') } = props;

  return (
    <Fragment>
      {!isEmpty(title) ? buildTitle(title) : null}
      {!isEmpty(description) ? buildDescription(description) : null}
      <Helmet>
        {!isEmpty(keywords) ? <meta name="keywords" content={keywords} /> : null}
        {/* <meta name="author" content={author} /> */}

        {/* {url ? <meta property="og:url" content={url} /> : null} */}

        <meta property="og:site_name" content="Kabbalah Media" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        {/* <meta name="twitter:card" content="summary" /> */}


        {/* Whatsapp */}
        {/* Title : Add Keyword rich title to your webpage with maximum of 65 characters. */}
        {/* Meta Description : Describe your web page in a maximum of 155 characters. */}
        {/* og:title : Maximum 35 characters. */}
        {/* og:url : Full link to your webpage address. */}
        {/* og:description : Maximum 65 characters. */}
        {/* og:image : Image(JPG or PNG) of size less than 300KB and minimum dimension of 300 x 200 pixel is advised. */}
        {/* favicon : A small icon of dimensions 32 x 32 pixels. */}
      </Helmet>
      {!isEmpty(imageUrl) ? <Image unitOrUrl={imageUrl} /> : null}
    </Fragment>
  );
};

Basic.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  url: PropTypes.string,
  keywords: PropTypes.string,
};

export default Basic;
