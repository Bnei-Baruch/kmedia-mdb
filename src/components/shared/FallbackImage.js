import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { knownFallbackImages, NoneFallbackImage, SectionThumbnailFallback } from '../../helpers/images';
import { actions } from '../../redux/modules/fetchImage';
import { fetchImageGetBySrcSelector } from '../../redux/selectors';
import WipErr from './WipErr/WipErr';

const getFloatClass = floated => {
  if (floated === 'left') return 'float-left';
  if (floated === 'right') return 'float-right';
  return '';
};

const FallbackImage = props => {
  const
    {
      src,
      fallbackImage = ['default'],
      className,
      width = 'auto',
      height = 'auto',

      floated,
      force16x9,
      ...rest
    } = props;

  const { src: imageSource, wip, err } = useSelector(state => fetchImageGetBySrcSelector(state, src));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!imageSource && !wip && !err) {
      dispatch(actions.fetch(src, fallbackImage));
    }
  }, [fallbackImage, src, imageSource, wip, err, dispatch]);

  if (!imageSource || imageSource === NoneFallbackImage) {
    /* There is no fallbacks and src was not found */
    return null;
  }

  const wipErr = WipErr({ wip: (wip || !imageSource), err });
  if (wipErr) return wipErr;

  if (!imageSource || imageSource === NoneFallbackImage) {
    /* There is no fallbacks and src was not found */
    return null;
  }

  if (knownFallbackImages.includes(imageSource)) {
    return (
      <div className={`${className} ${floated && 'floated'} ${floated}`} style={{ maxWidth: width }}>
        <SectionThumbnailFallback name={imageSource} width={width} height={height} force16x9={force16x9} {...rest} />
      </div>);
  }

  if (width && force16x9) {
    return (
      <div style={{ width, height: width * 9 / 16, overflow: 'hidden' }}>
        <img
          className={`${className || ''} ${getFloatClass(floated)}`}
          style={{ top: 'calc(-50%)', width: '100%' }}
          src={imageSource}
          {...rest}
        />
      </div>
    );
  }

  return (
    <img
      className={`${className || ''} ${getFloatClass(floated)}`}
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
