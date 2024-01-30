import React from 'react';
import PropTypes from 'prop-types';

import { sectionThumbnailFallback } from '../../helpers/images';
import clsx from 'clsx';

const FallbackImage = props => {
  const
    {
      src,
      fallbackImage = ['default'],
      className,
      width         = 'auto',
      height        = 'auto',

      floated,
      ...rest
    } = props;

  if (!src && (fallbackImage.length === 0 || !sectionThumbnailFallback[fallbackImage[0]])) {
    /* There is no fallbacks and src was not found */
    return null;
  }

  let styleImg = clsx({ float: floated }), styleDiv  = {};
  if (width && rest.force16x9) {
    styleDiv = clsx({
      width,
      height  : width * 9 / 16,
      overflow: 'hidden'
    });
    styleImg = clsx({
      top  : 'calc(-50%)',
      width: '100%',
      float: floated
    });
  }

  const svgFn = sectionThumbnailFallback[fallbackImage[0]];
  const svg   = svgFn ? svgFn({
    name  : { src },
    width : { width },
    height: { height },
    ...rest
  }) : '';

  return (
    <div style={{ ...styleDiv }}>
      <picture>
        <source srcSet={src} className={className} style={{ ...styleImg }} {...rest}/>
        <div className={`${className} ${floated && 'floated'} ${floated}`} style={{ maxWidth: width }}>
          {svg}
        </div>
      </picture>
    </div>);
};

FallbackImage.propTypes = {
  src          : PropTypes.string,
  fallbackImage: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array])),
  onLoad       : PropTypes.func,
  onError      : PropTypes.func
};

export default FallbackImage;
