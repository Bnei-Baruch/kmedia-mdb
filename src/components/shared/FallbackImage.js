import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Image } from 'semantic-ui-react';

import { knownFallbackImages, NoneFallbackImage, SectionThumbnailFallback } from '../../helpers/images';

// An adaptation of https://github.com/socialtables/react-image-fallback
// for react semantic-ui

const MAX_IMAGINARY_CALLS = 2;

const findSrc = async srcs => {
  for (const i in srcs) {
    if (knownFallbackImages.includes(srcs[i]))
      return srcs[i];

    const isLoad = await tryLoadImage(srcs[i]);
    if (isLoad)
      return srcs[i];

    const isFetch = await tryFetchImage(srcs[i]);
    if (isFetch)
      return srcs[i];
  }

  return null;
};

const tryLoadImage = src => new Promise(resolve => {
  const img   = new window.Image();
  img.onerror = () => resolve(false);
  img.onload  = () => resolve(true);
  img.src     = src;
});

const tryFetchImage = async (src, attempt = 0) => {
  if (attempt > MAX_IMAGINARY_CALLS) return false;

  try {
    const resp = await fetch(src);
    if (resp.status === 200) {
      return true;
    }

    if (resp.status === 429) {
      return tryFetchImage(src, attempt++);
    }

    return false;
  } catch (err) {
    return false;
  }
};

const FallbackImage = props => {
  const {
    src,
    fallbackImage = ['default'],
    className,
    onLoad,
    onError,
    width         = 'auto',
    height        = 'auto',
    floated,
    ...rest
  } = props;

  const [imageSource, setImageSource] = useState();
  const [wip, setWip]                 = useState(false);

  useEffect(() => {
    setWip(true);
    !wip && !imageSource && findSrc([src, ...fallbackImage])
      .then(res => {
        setImageSource(res);
        setWip(false);
      });
  }, [fallbackImage, src, wip, imageSource]);

  if (!imageSource || imageSource === NoneFallbackImage) {
    /* There is no fallbacks and src was not found */
    return null;
  }

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
          {...rest}
          src={imageSource}
        />
      </div>
    );
  }

  return (
    <Image
      className={className}
      floated={floated}
      {...rest}
      src={imageSource}
    />);
};

FallbackImage.propTypes = {
  src: PropTypes.string,
  fallbackImage: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array])),
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default FallbackImage;
