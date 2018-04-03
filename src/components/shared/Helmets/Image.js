import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { assetUrl, imaginaryUrl, Requests } from '../../../helpers/Api';
import { isEmpty } from '../../../helpers/utils';
import * as shapes from '../../shapes';

class Image extends Component {
  static propTypes = {
    unitOrUrl: PropTypes.oneOfType([
      shapes.ContentUnit,
      PropTypes.string,
    ])
  };

  static defaultProps = {
    unitOrUrl: null,
  };

  render() {
    const { unitOrUrl } = this.props;

    if (isEmpty(unitOrUrl)) {
      return null;
    }

    // TODO: facebook says its best to use 1200 x 630 for post,
    // // does imaginaryUrl get height ?
    //
    let imageUrl = unitOrUrl;
    // if unitOrUrl is a unit
    if (typeof (unitOrUrl) !== typeof ('')) {
      imageUrl = assetUrl(`api/thumbnail/${unitOrUrl.id}`);
      imageUrl = `${imaginaryUrl('resize')}?${Requests.makeParams({ url: imageUrl, width: 600, height: 315 })}`;
    }

    return (
      <Helmet>
        <meta property="og:image" content={imageUrl} />

        {/* TODO: should we use ?*/}
        {/*<meta property="og:image:secure_url" content="https://secure.example.com/ogp.jpg" />*/}

        {/*TODO (orin): move to image */}
        {/*{resizedImage ? <meta name="image" content={resizedImage} /> : null}*/}

        {/* Schema.org for Google */}
        {/*{resizedImage ? <meta itemprop="image" content={resizedImage} /> : null}*/}

        {/* Open Graph general (Facebook, Pinterest & Google+) */}
        {/* minimum required: title, image, url */}
        {/*{resizedImage ? <meta property="og:image" content={resizedImage} /> : null}*/}


      </Helmet>
    );
  }
}

export default Image;
