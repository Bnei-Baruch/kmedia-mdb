import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { assetUrl, imaginaryUrl, Requests } from '../../../helpers/Api';

class Image extends Component {
  static propTypes = {
    unitId: PropTypes.string.isRequired,
  };

  static defaultProps = {
  };

  render() {
    const { unitId } = this.props;

    let imageUrl = assetUrl(`api/thumbnail/${unitId}`);
    imageUrl = `${imaginaryUrl('thumbnail')}?${Requests.makeParams({ url: imageUrl, width: 512 })}`;

    return (
      <Helmet>
        {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}

        {/* TODO: should we use ?*/}
        {/*<meta property="og:image:secure_url" content="https://secure.example.com/ogp.jpg" />*/}


      </Helmet>
    );
  }
}

export default Image;
