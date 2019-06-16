import React from 'react';
import PropTypes from 'prop-types';

import { assetUrl } from '../../../helpers/Api';
import FallbackImage from '../FallbackImage';

const CollectionLogo = (props) => {
  const { collectionId, ...rest } = props;

  return (
    <FallbackImage
      fluid
      shape="rounded"
      className="collection-logo"
      src={assetUrl(`logos/collections/${collectionId}.jpg`)}
      {...rest}
    />
  );
};

CollectionLogo.propTypes = {
  collectionId: PropTypes.string,
};

CollectionLogo.defaultProps = {
  collectionId: null,
};

export default CollectionLogo;
