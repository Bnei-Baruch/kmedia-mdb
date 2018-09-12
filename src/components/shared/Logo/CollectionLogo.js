import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { assetUrl } from '../../../helpers/Api';
import FallbackImage from '../FallbackImage';

class CollectionLogo extends PureComponent {
  static propTypes = {
    collectionId: PropTypes.string,
  };

  static defaultProps = {
    collectionId: null,
  };

  render() {
    const { collectionId, ...props } = this.props;

    return (
      <FallbackImage
        {...props}
        fluid
        className="collection-logo"
        shape="rounded"
        src={assetUrl(`logos/collections/${collectionId}.jpg`)}
      />
    );
  }
}

export default CollectionLogo;
