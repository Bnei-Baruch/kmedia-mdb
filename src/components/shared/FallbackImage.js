import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { knownFallbackImages, NoneFallbackImage, SectionThumbnailFallback } from '../../helpers/images';
import { selectors, actions } from '../../redux/modules/fetchImage';
import WipErr from './WipErr/WipErr';
import { useTranslation } from 'react-i18next';

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

  const { src: imageSource, wip, err } = useSelector(state => selectors.getBySrc(state.fetchImage, src));
  const dispatch                       = useDispatch();
  const { t }                          = useTranslation();

  useEffect(() => {
    if (!imageSource && !wip && !err) {
      dispatch(actions.fetch(src, fallbackImage));
    }
  }, [fallbackImage, src, imageSource, wip, err]);

  if (!imageSource || imageSource === NoneFallbackImage) {
    /* There is no fallbacks and src was not found */
    return null;
  }

  const wipErr = WipErr({ wip: (wip || !imageSource), err, t });
  if (wipErr) return wipErr;

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

export default FallbackImage;
