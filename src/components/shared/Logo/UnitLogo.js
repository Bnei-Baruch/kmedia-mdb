import React from 'react';
import PropTypes from 'prop-types';

import { assetUrl, imaginaryUrl, Requests } from '../../../helpers/Api';
import FallbackImage from '../FallbackImage';

const UnitLogo = (props) => {
  const { unitId, collectionId, width, className, fallbackImg, ...rest } = props;

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
      className={`unit-logo ${className}`}
      fallbackImage={[
        collectionId ? assetUrl(`logos/collections/${collectionId}.png`) : null,
        fallback
      ]}
    />
  );
};

UnitLogo.propTypes = {
  unitId: PropTypes.string,
  collectionId: PropTypes.string,
  width: PropTypes.number,
  className: PropTypes.string,
  fallbackImg: PropTypes.any,
};

UnitLogo.defaultProps = {
  unitId: null,
  collectionId: null,
  width: 120,
  className: '',
  fallbackImg: 'default',
};

export default UnitLogo;
