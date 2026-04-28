import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import ImageGallery from 'react-image-gallery';
import FallbackImage from '../../shared/FallbackImage';
import { imageGalleryItem } from '../../Pages/WithPlayer/widgets/UnitMaterials/Sketches/helper';
import { settingsGetUIDirSelector } from '../../../redux/selectors';

const ImageFileModal = ({ file }) => {
  const [open, setOpen] = useState(false);

  const ref = useRef();
  const uiDir = useSelector(settingsGetUIDirSelector);
  const items = [file].map(imageGalleryItem);

  const renderFullscreenButton = (onClick, isFullscreen) => (
    <button
      className="image-gallery-fullscreen-button bg-black text-white small px-3 py-1 rounded"
      onClick={onClick}
    >
      <span className="material-symbols-outlined">{isFullscreen ? 'compress' : 'expand'}</span>
    </button>
  );

  return (
    <>
      <FallbackImage
        src={items[0]?.original}
        width={280}
        className="unit-logo"
        onClick={() => setOpen(true)}
      />
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded shadow-xl max-w-3xl w-full p-4 relative" dir={uiDir}>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
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
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ImageFileModal;
