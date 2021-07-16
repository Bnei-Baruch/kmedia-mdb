import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';

import { knownFallbackImages, SectionThumbnailFallback } from '../../helpers/images';

// An adaptation of https://github.com/socialtables/react-image-fallback
// for react semantic-ui
const FallbackImage = props => {
  const { src, fallbackImage = ['default'], className, onLoad, onError, width = 'auto', height = 'auto', ...rest } = props;
  const [imageSource, setImageSource] = useState(src);

  useEffect(() => {
    const displayImage = new window.Image();

    const setDisplayImage = (image, fallbacks) => {
      const imagesArray = [image].concat(fallbacks).filter(fallback => !!fallback);

      displayImage.onerror = () => {
        if (imagesArray.length > 2 && typeof imagesArray[1] === 'string') {
          const updatedFallbacks = imagesArray.slice(2);
          setDisplayImage(imagesArray[1], updatedFallbacks);
          return;
        }

        setImageSource(imagesArray[1] || null);

        if (onError) {
          onError(src);
        }
      };

      displayImage.onload = () => {
        setImageSource(imagesArray[0]);

        if (onLoad) {
          onLoad(imagesArray[0]);
        }
      };

      if (typeof imagesArray[0] === 'string') {
        displayImage.src = imagesArray[0];
      } else {
        setImageSource(imagesArray[0]);

        if (onLoad) {
          onLoad(imagesArray[0]);
        }
      }
    };

    setDisplayImage(src, fallbackImage);

    return () => {
      displayImage.onerror = null;
      displayImage.onload  = null;
    }
  }, [fallbackImage, onError, onLoad, src]);


  if (imageSource === null) {
    /* There is no fallbacks and src was not found */
    return null;
  }

  if (knownFallbackImages.includes(imageSource)) {
    return (
      <div className={className}>
        <SectionThumbnailFallback name={imageSource} width={width} height={height} />
      </div>);
  }

  return (
    <Image
      className={className}
      {...rest}
      src={imageSource}
    />);
}

FallbackImage.propTypes = {
  src: PropTypes.string,
  fallbackImage: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array])),
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default FallbackImage;
