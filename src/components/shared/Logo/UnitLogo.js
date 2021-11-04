import React from 'react';
import PropTypes from 'prop-types';

import { assetUrl, cmsImagesUrl, Requests } from '../../../helpers/Api';
import FallbackImage from '../FallbackImage';

const UnitLogo = props => {
  const { unitId       = null,
          collectionId = null,
          width        = 120,
          height,
          className    = '',
          fallbackImg  = 'default',
          ...rest
        } = props;

  let src;
  if (unitId) {
    src = Requests.imaginary('thumbnail', {
      url: assetUrl(`api/thumbnail/${unitId}`),
      width,
      stripmeta: true,
    });
  } else if (collectionId) {
    src = Requests.imaginary('thumbnail', {
      url: cmsImagesUrl(`logos/${collectionId}.jpg`),
      width,
      height,
      stripmeta: true
    });
  }

  const fallback = fallbackImg || 'default';

  return (
    <FallbackImage
      {...rest}
      src={src}
      width={width}
      height={height}
      className={`unit-logo ${className} ui image`}
      fallbackImage={[fallback]}
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

export default UnitLogo;
