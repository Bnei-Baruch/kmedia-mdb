import React from 'react';
import { useSelector } from 'react-redux';
import ImageGallery from 'react-image-gallery';
import { Button } from 'semantic-ui-react';
import { settingsGetUIDirSelector } from '../../../../../../redux/selectors';

const SketchesGallery = ({ items }) => {
  const uiDir = useSelector(settingsGetUIDirSelector);

  const handleImageError = event => console.log('Image Gallery loading error ', event.target);

  const renderLeftNav = (onClick, disabled) => (
    <Button
      color="black"
      size="tiny"
      className="image-gallery-left-nav"
      icon="chevron left"
      disabled={disabled}
      onClick={onClick}
    />
  );

  const renderRightNav = (onClick, disabled) => (
    <Button
      color="black"
      size="tiny"
      className="image-gallery-right-nav"
      icon="chevron right"
      disabled={disabled}
      onClick={onClick}
    />
  );

  const renderFullscreenButton = (onClick, isFullscreen) => (
    <Button
      color="black"
      size="tiny"
      className="image-gallery-fullscreen-button"
      icon={<span className="material-symbols-outlined">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>}
      onClick={onClick}
    />
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
