import React from 'react';
import PropTypes from 'prop-types';

import { assetUrl, Requests } from '../../../helpers/Api';
import FallbackImage from '../FallbackImage';

const UnitLogo = props => {
  const { unitId = null, collectionId = null, width = 120, className = '', fallbackImg = 'default', ...rest } = props;

  const src = Requests.imaginary('thumbnail', {
    url: assetUrl(`api/thumbnail/${unitId}`),
    width,
    stripmeta: true,
  });

  const fallback = fallbackImg || 'default';

  return (
    <FallbackImage
      {...rest}
      src={src}
      width={width}
      className={`unit-logo ${className} ui image`}
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

export default UnitLogo;
