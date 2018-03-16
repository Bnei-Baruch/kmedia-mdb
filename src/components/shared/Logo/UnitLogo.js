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
    className: PropTypes.string,
    fallbackImg: PropTypes.any,
  };

  static defaultProps = {
    unitId: null,
    collectionId: null,
    width: 120,
    className: '',
    fallbackImg: imagePlaceholder,
  };

  render() {
    const { unitId, collectionId, width, className, fallbackImg, ...rest } = this.props;

    let src = assetUrl(`api/thumbnail/${unitId}`);

    if (!src.startsWith('http')) {
      src = `http://localhost${src}`;
    }

    src = `${imaginaryUrl('thumbnail')}?${Requests.makeParams({ url: src, width })}`;

    const fallback = fallbackImg || imagePlaceholder;

    return (
      <FallbackImage
        {...rest}
        src={src}
        className={`unit-logo ${className}`}
        initialImage={fallback}
        fallbackImage={[
          collectionId ? assetUrl(`logos/collections/${collectionId}.png`) : null,
          fallback
        ]}
      />
    );
  }
}

export default UnitLogo;
