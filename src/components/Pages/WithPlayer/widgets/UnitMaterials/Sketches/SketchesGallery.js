import React from 'react';
import { useSelector } from 'react-redux';
import ImageGallery from 'react-image-gallery';
import { settingsGetUIDirSelector } from '../../../../../../redux/selectors';

const SketchesGallery = ({ items }) => {
  const uiDir = useSelector(settingsGetUIDirSelector);

  const handleImageError = event => console.log('Image Gallery loading error ', event.target);

  const renderLeftNav = (onClick, disabled) => (
    <button
      className="image-gallery-left-nav bg-black text-white px-2 py-1 rounded small"
      disabled={disabled}
      onClick={onClick}
    >
      <span className="material-symbols-outlined">chevron_left</span>
    </button>
  );

  const renderRightNav = (onClick, disabled) => (
    <button
      className="image-gallery-right-nav bg-black text-white px-2 py-1 rounded small"
      disabled={disabled}
      onClick={onClick}
    >
      <span className="material-symbols-outlined">chevron_right</span>
    </button>
  );

  const renderFullscreenButton = (onClick, isFullscreen) => (
    <button
      className="image-gallery-fullscreen-button bg-black text-white px-2 py-1 rounded small"
      onClick={onClick}
    >
      <span className="material-symbols-outlined">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
    </button>
  );

  return (
    <ImageGallery
      lazyLoad
      showFullscreenButton
      isRTL={uiDir === 'rtl'}
      items={items}
      thumbnailPosition="top"
      showPlayButton={false}
      showBullets={false}
      showIndex={items.length > 1}
      showThumbnails={items.length > 1}
      onImageError={handleImageError}
      renderLeftNav={renderLeftNav}
      renderRightNav={renderRightNav}
      renderFullscreenButton={renderFullscreenButton}
    />
  );
};

export default SketchesGallery;
