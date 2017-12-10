import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { assetUrl, imaginaryUrl, Requests } from '../../../helpers/Api';
import FallbackImage from '../FallbackImage';
import imagePlaceholder from '../../../images/image.png';

class UnitLogo extends PureComponent {
  static propTypes = {
    unitId: PropTypes.string,
    collectionId: PropTypes.string,
    width: PropTypes.number,
  };

  static defaultProps = {
    unitId: null,
    collectionId: null,
    width: 120,
  };

  render() {
    const { unitId, collectionId, width, ...rest } = this.props;

    let src = assetUrl(`api/thumbnail/${unitId}`);

    if (!src.startsWith('http')) {
      src = 'http://localhost' + src;
    }

    src = `${imaginaryUrl('thumbnail')}?${Requests.makeParams({ url: src, width })}`;

    return (
      <FallbackImage
        {...rest}
        src={src}
        initialImage={imagePlaceholder}
        fallbackImage={[
          collectionId ? assetUrl(`logos/collections/${collectionId}.png`) : null,
          imagePlaceholder
        ]}
      />
    );
  }
}

export default UnitLogo;


