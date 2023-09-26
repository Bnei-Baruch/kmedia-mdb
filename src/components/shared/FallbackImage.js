'use client';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { knownFallbackImages, NoneFallbackImage, SectionThumbnailFallback } from '../../helpers/images';
import { selectors, imageFetch } from '../../../lib/redux/slices/imageSlice';
import WipErr from './WipErr/WipErr';

const FallbackImage = props => {
  const {
          src,
          fallbackImage = ['default'],
          className,
          width         = 'auto',
          height        = 'auto',
          floated,
          ...rest
        } = props;

  const { src: imageSource, wip, err } = useSelector(state => selectors.getBySrc(state.image, src));
  const dispatch                       = useDispatch();

  useEffect(() => {
    if (!imageSource && !wip && !err) {
      dispatch(imageFetch({ src, fallbacks: fallbackImage }));
    }
  }, [fallbackImage, src, imageSource, wip, err]);

  const wipErr = WipErr({ wip: (wip || !imageSource || imageSource === NoneFallbackImage), err });
  if (wipErr) return wipErr;

  if (knownFallbackImages.includes(imageSource)) {
    return (
      <div className={`${className} ${floated && 'floated'} ${floated}`} style={{ maxWidth: width }}>
        <SectionThumbnailFallback name={imageSource} width={width} height={height} {...rest} />
      </div>);
  }

  if (width && rest.force16x9) {
    return (
      <div style={{ width, height: width * 9 / 16, overflow: 'hidden' }}>
        <Image
          className={className}
          style={{ top: 'calc(-50%)', width: '100%' }}
          floated={floated}
          src={imageSource}
          {...rest}
        />
      </div>
    );
  }

  return (
    <Image
      className={className}
      floated={floated}
      src={imageSource}
      {...rest}
    />);
};

FallbackImage.propTypes = {
  src: PropTypes.string,
  fallbackImage: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array])),
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

const areEqual = (prevProps, nextProps) => !nextProps.src || (prevProps.src === nextProps.src);

export default React.memo(FallbackImage, areEqual);
