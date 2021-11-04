import React from 'react';
import PropTypes from 'prop-types';

import { cmsImagesUrl, Requests } from '../../../helpers/Api';
import FallbackImage from '../FallbackImage';

const CollectionLogo = props => {
  const { collectionId = null, ...rest } = props;

  const src = Requests.imaginary('thumbnail', {
    url: cmsImagesUrl(`logos/${collectionId}.jpg`),
    width: 250,
    stripmeta: true
  });

  return (
    <FallbackImage
      fluid
      shape="rounded"
      className="collection-logo ui fluid image"
      src={src}
      {...rest}
    />
  );
};

CollectionLogo.propTypes = {
  collectionId: PropTypes.string,
};

export default CollectionLogo;
