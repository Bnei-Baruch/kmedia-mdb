import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { assetUrl, Requests } from '../../../helpers/Api';
import FallbackImage from '../FallbackImage';

import { selectors as sources } from '../../../redux/modules/sources';

import portraitBS from '../../../images/portrait_bs.png';
import portraitRB from '../../../images/portrait_rb.png';
import portraitML from '../../../images/portrait_ml.png';

const portraits = { bs: portraitBS, rb: portraitRB, ml: portraitML };

const UnitLogo = props => {
  const { unitId = null, collectionId = null, sourceId = null, width = 120, className = '', fallbackImg = 'default', ...rest } = props;
  const sourcePath = useSelector(state => sources.getPathByID(state.sources)(sourceId));

  const src = unitId !== null ? Requests.imaginary('thumbnail', {
    url: assetUrl(`api/thumbnail/${unitId}`),
    width,
    stripmeta: true,
  }) : null;

  const fallback = sourceId !== null && sourcePath && sourcePath.length ? portraits[sourcePath[0].id] : fallbackImg;
  const force16x9 = sourceId !== null ? 'true' : undefined;

  return (
    <FallbackImage
      {...rest}
      src={src}
      width={width}
      className={`unit-logo ${className} ui image`}
      fallbackImage={[
        collectionId ? assetUrl(`logos/collections/${collectionId}.jpg`) : null,
        fallback
      ]}
      force16x9={force16x9}
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
