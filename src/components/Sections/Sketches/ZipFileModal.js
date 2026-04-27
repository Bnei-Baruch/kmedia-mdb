import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import ImageGallery from 'react-image-gallery';
import FallbackImage from '../../shared/FallbackImage';
import { assetUrl } from '../../../helpers/Api';
import { imageGalleryItem } from '../../Pages/WithPlayer/widgets/UnitMaterials/Sketches/helper';
import { settingsGetUIDirSelector, assetsNestedGetZipByIdSelector } from '../../../redux/selectors';

const ZipFileModal = ({ id, path }) => {
  const [open, setOpen] = useState(false);

  const getZipById = useSelector(assetsNestedGetZipByIdSelector);
  const uiDir      = useSelector(settingsGetUIDirSelector);
  const ref        = useRef();

  const { data: { uniq, full } } = getZipById(id);

  const uniqIdx  = uniq.findIndex(x => x.path === path);
  const prev     = uniq?.[uniqIdx - 1] || null;
  const startIdx = prev ? full.findIndex(x => x.path === prev.path) + 1 : 0;
  const endIdx   = full.findIndex(x => x.path === path);

  const items = full.slice(startIdx, endIdx + 1).map(imageGalleryItem);

  const renderLeftNav = (onClick, disabled) => (
    <button
      className="image-gallery-left-nav bg-black text-white small px-3 py-1 rounded"
      disabled={disabled}
      onClick={onClick}
    >
      <span className="material-symbols-outlined">chevron_left</span>
    </button>
  );

  const renderRightNav = (onClick, disabled) => (
    <button
      className="image-gallery-right-nav bg-black text-white small px-3 py-1 rounded"
      disabled={disabled}
      onClick={onClick}
    >
      <span className="material-symbols-outlined">chevron_right</span>
    </button>
  );

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
        src={assetUrl(path.substring(8))}
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
              startIndex={items.length - 1}
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
              renderLeftNav={renderLeftNav}
              renderRightNav={renderRightNav}
              renderFullscreenButton={renderFullscreenButton}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default withTranslation()(ZipFileModal);
