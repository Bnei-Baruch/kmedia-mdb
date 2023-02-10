import React, { useRef, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'semantic-ui-react';
import { isLanguageRtl, getLanguageDirection } from '../../../helpers/i18n-utils';
import { selectors as settings } from '../../../redux/modules/settings';
import ImageGallery from 'react-image-gallery';
import { imageGalleryItem } from '../../Pages/Unit/widgets/UnitMaterials/helper';
import FallbackImage from '../../shared/FallbackImage';

const ImageFileModal = ({ file }) => {
  const [open, setOpen] = useState(false);

  const ref      = useRef();
  const language = useSelector(state => settings.getLanguage(state.settings));
  const items    = [file].map(imageGalleryItem);

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
        <Modal.Content dir={getLanguageDirection(language)}>
          <ImageGallery
            ref={ref}
            lazyLoad
            showFullscreenButton
            isRTL={isLanguageRtl(language)}
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

export default withNamespaces()(ImageFileModal);
