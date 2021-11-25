import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';

import { knownFallbackImages, SectionThumbnailFallback } from '../../helpers/images';
import { IMAGINARY_URL } from '../../helpers/Api';

// An adaptation of https://github.com/socialtables/react-image-fallback
// for react semantic-ui

const loadStatus = {
  error: -1,
  loaded: 1
};

const imgLoadStatus       = new Map();
let imaginaryCalls        = 0;
const MAX_IMAGINARY_CALLS = 5;

const buildImage = (src, fallbacks, onError, onLoad) => {
  const displayImage = new window.Image();

  displayImage.onerror = () => {
    imgLoadStatus.set(displayImage.src, loadStatus.error);
    handleError(displayImage.src, fallbacks);
  };

  displayImage.onload = () => {
    imgLoadStatus.set(displayImage.src, loadStatus.loaded);
    handleLoaded(displayImage.src);
  };

  const handleLoaded = image => {
    if (image.includes(IMAGINARY_URL))
      imaginaryCalls--;

    onLoad(image);
  };

  const handleError = () => {
    if (displayImage.src.includes(IMAGINARY_URL))
      imaginaryCalls--;

    if (typeof fallbacks[0] === 'string') {
      const image = fallbacks[0];
      fallbacks   = fallbacks.slice(1);
      setDisplayImage(image, fallbacks);
      return;
    }

    onError();
  };

  const setDisplayImage = (image, fallbacks) => {
    if (knownFallbackImages.includes(image)) {
      handleLoaded(image);
      return;
    }

    if (imgLoadStatus.get(image) === loadStatus.error) {
      handleError();
      return;
    }

    if (imgLoadStatus.get(image) === loadStatus.loaded) {
      handleLoaded(image);
      return;
    }

    if (image.includes(IMAGINARY_URL) && imaginaryCalls >= MAX_IMAGINARY_CALLS) {
      setTimeout(() => setDisplayImage(image, fallbacks), 300);
      return;
    }

    if (typeof image === 'string') {
      if (image.includes(IMAGINARY_URL)) imaginaryCalls++;
      displayImage.src = image;
    } else {
      onLoad(image);
    }
  };

  setDisplayImage(src, fallbacks);
};

const FallbackImage = props => {
  const {
    src,
    fallbackImage = ['default'],
    className,
    onLoad,
    onError,
    width = 'auto',
    height = 'auto',
    ...rest
  }                             = props;
  const [imageSource, setImageSource] = useState();

  useEffect(() => {
    const displayImage = buildImage(src, fallbackImage, handleError, handleLoaded);

    return () => {
      displayImage && (displayImage.onerror = null);
      displayImage && (displayImage.onload = null);
    };
  }, [fallbackImage, src]);

  const handleLoaded = image => {
    setImageSource(image);

    if (onLoad) {
      onLoad(image);
    }
  };

  const handleError = () => {
    setImageSource(null);

    if (onError) {
      onError(src);
    }
  };

  if (!imageSource) {
    /* There is no fallbacks and src was not found */
    return null;
  }

  if (knownFallbackImages.includes(imageSource)) {
    return (
      <div className={className} style={{ maxWidth: width }}>
        <SectionThumbnailFallback name={imageSource} width={width} height={height} {...rest} />
      </div>);
  }

  if (width && rest.force16x9) {
    return (
      <div style={{ width, height: width * 9 / 16, overflow: 'hidden' }}>
        <Image
          className={className}
          style={{ top: 'calc(-50%)', width: '100%' }}
          {...rest}
          src={imageSource}
        />
      </div>
    );
  }

  return (
    <Image
      className={className}
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
