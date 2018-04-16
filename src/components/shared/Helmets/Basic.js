import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { isEmpty, publicFile } from '../../../helpers/utils';
import Image from './Image';

class Basic extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    url: PropTypes.string,
    keywords: PropTypes.string,

  };

  static defaultProps = {
    title: null,
    description: null,
    imageUrl: publicFile('seo/default.png'),
    url: null,
    keywords: null,
  };

  // eslint-disable-next-line class-methods-use-this
  buildTitle(title) {
    return (
      <Helmet>
        <title>{title}</title>
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        {/* Schema.org */}
        {/* <meta itemProp="name" content={title} /> */}
      </Helmet>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  buildDescription(description) {
    return (
      <Helmet>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        {/* <meta itemProp="description" content={description} /> */}
        {/* <meta name="twitter:description" content={description} /> */}
      </Helmet>
    );
  }

  render() {
    const { title, description, keywords, url, imageUrl } = this.props;

    // ALL TODOS:
    // publication: language should be implemented

    // TODO (orin): throw away keywords!!
    // Schema.org

    // article/book/audio/video/website
    // language, image, url,

    // use https://richpreview.com to validate tags
    // https://d2eeipcrcdle6.cloudfront.net/seo-cheat-sheet.pdf
    // link canonical tag is very important !!!!

    // author
    // article:section
    // article:tag

    // for video clips we should use video.other
    // og:updated_time ??
    // og:ttl ??

    // episode distinction ?

    // Programs original language is always en !!!

    // The four required properties for every page are:
    // og:title, og:type, og:image, og:url

    // og:determiner

    /* <link rel=�author� href=�https://plus.google.com/[YOUR PERSONAL G+ PROFILE HERE]�/> */

    // TODO:  Publication have the word pirsum at the title, it should be removed.
    // }

    // TODO (orin): Add basic helmets for keywords and stuff.
    // TODO (orin): Add microdata
    // TODO (orin): JSON-LD

    return (
      <div>
        {!isEmpty(title) ? this.buildTitle(title) : null}
        {!isEmpty(description) ? this.buildDescription(description) : null}
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
      </div>
    );
  }
}

export default Basic;
