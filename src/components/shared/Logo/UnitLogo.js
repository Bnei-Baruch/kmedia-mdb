import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { assetUrl, imaginaryUrl, Requests } from '../../../helpers/Api';
import FallbackImage from '../FallbackImage';

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
    fallbackImg: 'default',
  };

  render() {
    const { unitId, collectionId, width, className, fallbackImg, ...rest } = this.props;

    let src = assetUrl(`api/thumbnail/${unitId}`);
    if (!src.startsWith('http')) {
      src = `http://localhost${src}`;
    }
    const params = Requests.makeParams({ url: src, width, stripmeta: true, });
    src          = `${imaginaryUrl('thumbnail')}?${params}`;

    const fallback = fallbackImg || 'default';

    return (
      <FallbackImage
        {...rest}
        src={src}
        width={width}
        className={`unit-logo ${className}`}
        fallbackImage={[
          collectionId ? assetUrl(`logos/collections/${collectionId}.png`) : null,
          fallback
        ]}
      />
    );
  }
}

export default UnitLogo;
