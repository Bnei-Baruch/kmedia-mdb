import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { isEmpty } from '../../../helpers/utils';
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
    description: null,
    imageUrl: 'https://archive.kbb1.com/logo_temp.png',
    url: null,
    keywords: null,
  };

  render() {
    const { title, description, keywords, url, imageUrl } = this.props;

    // ALL TODOS:
    // publication: language should be implemented

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

    // facebook blocked http://files.kbb1.com/orineden/
    // should we unblocked it ?

    {/*<link rel=�author� href=�https://plus.google.com/[YOUR PERSONAL G+ PROFILE HERE]�/>*/
    }

    //TODO:  Publication have the word pirsum at the title, it should be removed.
    // let resizedImage = null;
    // if (imageUrl) {
    //   resizedImage = `${imaginaryUrl('thumbnail')}?${Requests.makeParams({ url: imageUrl, width: 1200, height: 630 })}`;
    // }

    // TODO (orin): Add basic helmets for keywords and stuff.

    return (
      <div>
        <Helmet>
          {!isEmpty(title) ? <title>{title}</title> : null}
          {!isEmpty(description) ? <meta name="description" content={description} /> : null}
          {!isEmpty(keywords) ? <meta name="keywords" content={keywords} /> : null}
          {/*<meta name="author" content={author} />*/}


          {/* Schema.org for Google */}
          {!isEmpty(title) ? <meta itemprop="name" content={title} /> : null}
          {!isEmpty(description) ? <meta itemprop="description" content={description} /> : null}
          {/*{resizedImage ? <meta itemprop="image" content={resizedImage} /> : null}*/}

          {/* Open Graph general (Facebook, Pinterest & Google+) */}
          {/* minimum required: title, image, url */}
          {!isEmpty(title) ? <meta property="og:title" content={title} /> : null}
          {/*{resizedImage ? <meta property="og:image" content={resizedImage} /> : null}*/}
          {/*{url ? <meta property="og:url" content={url} /> : null}*/}

          {/* optional Open Graph */}
          {!isEmpty(description) ? <meta property="og:description" content={description} /> : null}
          <meta property="og:site_name" content="Kabbalah Media" />


          <meta property="og:type" content="website" />


          {/* Twitter */}
          {/*<meta name="twitter:card" content="summary" />*/}
          {/*{title ? <meta name="twitter:title" content={title} /> : null}*/}
          {/*{description ? <meta name="twitter:description" content={description} /> : null}*/}


          {/*Whatsapp*/}
          {/*Title : Add Keyword rich title to your webpage with maximum of 65 characters.*/}
          {/*Meta Description : Describe your web page in a maximum of 155 characters.*/}
          {/*og:title : Maximum 35 characters.*/}
          {/*og:url : Full link to your webpage address.*/}
          {/*og:description : Maximum 65 characters.*/}
          {/*og:image : Image(JPG or PNG) of size less than 300KB and minimum dimension of 300 x 200 pixel is advised.*/}
          {/*favicon : A small icon of dimensions 32 x 32 pixels.*/}
        </Helmet>
        {!isEmpty(imageUrl) ? <Image unitOrUrl={imageUrl} /> : null}
      </div>
    );
  }
}

export default Basic;
