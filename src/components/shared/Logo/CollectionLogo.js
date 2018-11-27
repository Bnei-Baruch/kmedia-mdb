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
    const { collectionId, ...rest } = this.props;

    return (
      <FallbackImage
        fluid
        shape="rounded"
        className="collection-logo"
        src={assetUrl(`logos/collections/${collectionId}.jpg`)}
        {...rest}
      />
    );
  }
}

export default CollectionLogo;
