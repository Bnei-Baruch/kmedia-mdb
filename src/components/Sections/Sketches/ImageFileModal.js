import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'semantic-ui-react';
import ImageGallery from 'react-image-gallery';
import FallbackImage from '../../shared/FallbackImage';
import { imageGalleryItem } from '../../Pages/WithPlayer/widgets/UnitMaterials/Sketches/helper';
import { settingsGetUIDirSelector } from '../../../redux/selectors';

const ImageFileModal = ({ file }) => {
  const [open, setOpen] = useState(false);

  const ref   = useRef();
  const uiDir = useSelector(settingsGetUIDirSelector);
  const items = [file].map(imageGalleryItem);

  const renderFullscreenButton = (onClick, isFullscreen) => (
    <Button
      color="black"
      size="tiny"
      className="image-gallery-fullscreen-button"
      icon={isFullscreen ? 'compress' : 'expand'}
      onClick={onClick}
    />
  );

  return (
    <>
      <FallbackImage
        src={items[0]?.original}
        width={280}
        className={`unit-logo ui image`}
        onClick={e => setOpen(true)}
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeIcon
      >
        <Modal.Content dir={uiDir}>
          <ImageGallery
            ref={ref}
            lazyLoad
            showFullscreenButton
            isRTL={uiDir === 'rtl'}
            items={items}
            thumbnailPosition="top"
            showPlayButton={false}
            showBullets={false}
            showIndex={items.length > 1}
            showThumbnails={items.length > 1}
            renderFullscreenButton={renderFullscreenButton}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default withTranslation()(ImageFileModal);
