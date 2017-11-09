import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { assetUrl } from '../../../helpers/Api';
import FallbackImage from '../FallbackImage';
import imagePlaceholder from '../../../images/image.png';

class UnitLogo extends PureComponent {
  static propTypes = {
    unitId: PropTypes.string,
    collectionId: PropTypes.string,
  };

  static defaultProps = {
    unitId: null,
    collectionId: null,
  };

  render() {
    const { unitId, collectionId, ...rest } = this.props;

    return (
      <FallbackImage
        {...rest}
        src={assetUrl(`logos/units/${unitId}.png`)}
        initialImage={imagePlaceholder}
        fallbackImage={[
          collectionId ? assetUrl(`logos/collections/${collectionId}.png`) : null,
          imagePlaceholder
        ]}
      />
    );
  }
}

export default UnitLogo;


