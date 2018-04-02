import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

class Basic extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    url: PropTypes.string,
    keywords: PropTypes.string,

  };

  static defaultProps = {
    description: null,
    url: null,
    keywords: null,
  };

  render() {
    const { title, description, keywords, url } = this.props;
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

    return (
      <Helmet>
        {/*Basic html meta*/}
        <title>{title}</title>
        {description ? <meta name="description" content={description} /> : null}
        {keywords ? <meta name="keywords" content={keywords} /> : null}
        {/*<meta name="author" content={author} />*/}

        {/* Opean graph*/}
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content="Kabbalah Media" />

        {description ? <meta property="og:description" content={description} /> : null}
        {/*{image ? <meta property="og:image" content={image} /> : null}*/}
        {/*canonical URL*/}
        {url ? <meta property="og:url" content={url} /> : null}


        {/*<meta property="og:site_name" content="" />*/}

        {/*<meta property="og:type" content="website" />*/}


        {/*<meta property="og:locale" content="fr_FR" />*/}
        {/*<meta property="og:locale:alternate" content="fr_FR" />*/}
        {/*<meta property="og:locale:alternate" content="es_ES" />*/}


        {/*Whatsapp*/}
        {/*Title : Add Keyword rich title to your webpage with maximum of 65 characters.*/}
        {/*Meta Description : Describe your web page in a maximum of 155 characters.*/}
        {/*og:title : Maximum 35 characters.*/}
        {/*og:url : Full link to your webpage address.*/}
        {/*og:description : Maximum 65 characters.*/}
        {/*og:image : Image(JPG or PNG) of size less than 300KB and minimum dimension of 300 x 200 pixel is advised.*/}
        {/*favicon : A small icon of dimensions 32 x 32 pixels.*/}
      </Helmet>
    );
  }
}

export default Basic;
