import React from 'react';
import PropTypes from 'prop-types';

import { Requests, cLogoUrl, assetUrl } from '../../../helpers/Api';
import FallbackImage from '../FallbackImage';

const CollectionLogo = props => {
  const { collectionId = null, ...rest } = props;

  const srcParams = { url: cLogoUrl(`${collectionId}.jpg`), width: 250, stripmeta: true };
  const src       = Requests.imaginary('thumbnail', srcParams);
  srcParams.url   = assetUrl(`logos/collections/${collectionId}.jpg`);
  const fallbacks = [Requests.imaginary('thumbnail', srcParams), 'default'];

  return (
    <FallbackImage
      fluid
      shape="rounded"
      className="collection-logo ui fluid image"
      src={src}
      fallbackImage={fallbacks}
      {...rest}
    />
  );
};

CollectionLogo.propTypes = {
  collectionId: PropTypes.string,
};

export default CollectionLogo;
