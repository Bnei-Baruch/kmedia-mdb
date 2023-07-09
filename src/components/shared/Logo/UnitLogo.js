import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { assetUrl, Requests, cLogoUrl } from '../../../helpers/Api';
import FallbackImage from '../FallbackImage';

import { selectors as sources } from '../../../redux/modules/sources';

import portraitBS from '../../../images/portrait_bs.png';
import portraitRB from '../../../images/portrait_rb.png';
import portraitML from '../../../images/portrait_ml.png';

const portraits = { bs: portraitBS, rb: portraitRB, ml: portraitML };

const makeImaginary = (cuId, cId, width, height) => {
  if (cuId) {
    const src = Requests.imaginary('thumbnail', { url: assetUrl(`api/thumbnail/${cuId}`), width, stripmeta: true, });
    return { src, fallbacks: [] };
  }

  if (cId) {
    const srcParams = { url: cLogoUrl(`${cId}.jpg`), width, height, stripmeta: true };
    const src       = Requests.imaginary('thumbnail', srcParams);
    srcParams.url   = assetUrl(`logos/collections/${cId}.jpg`);
    const fallbacks = [Requests.imaginary('thumbnail', srcParams), 'default'];

    return { src, fallbacks };
  }

  return { src: '/fake_image_url_for_show_fallback', fallbacks: [] };
};

const UnitLogo = props => {
  const {
          unitId       = null,
          collectionId = null,
          sourceId     = null,
          width        = 120,
          height,
          className    = '',
          fallbackImg  = 'default',
          ...rest
        } = props;

  const sourcePath = useSelector(state => sources.getPathByID(state.sources)(sourceId));

  const { src, fallbacks } = makeImaginary(unitId, collectionId, width, height);

  const fallback  = sourceId !== null && sourcePath && sourcePath.length ? portraits[sourcePath[0].id] : fallbackImg;
  const force16x9 = sourceId !== null ? 'true' : undefined;

  return (
    <FallbackImage
      {...rest}
      src={src}
      width={width}
      height={height}
      className={`unit-logo ${className} ui image`}
      fallbackImage={[...fallbacks, fallback]}
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
