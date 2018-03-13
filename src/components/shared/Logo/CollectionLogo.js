import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { assetUrl } from '../../../helpers/Api';
import FallbackImage from '../FallbackImage';
import imagePlaceholder from '../../../images/image.png';

class CollectionLogo extends PureComponent {
  static propTypes = {
    collectionId: PropTypes.string,
  };

  static defaultProps = {
    collectionId: null,
  };

  render() {
    const { collectionId } = this.props;

    return (
      <FallbackImage
        fluid
        className="collection-logo"
        shape="rounded"
        initialImage={imagePlaceholder}
        src={assetUrl(`logos/collections/${collectionId}.jpg`)}
      />
    );
  }
}

export default CollectionLogo;
