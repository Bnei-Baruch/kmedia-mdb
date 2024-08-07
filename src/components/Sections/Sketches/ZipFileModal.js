import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'semantic-ui-react';
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
      icon={isFullscreen ? 'compress' : 'expand'}
      onClick={onClick}
    />
  );

  return (
    <>
      <FallbackImage
        src={assetUrl(path.substring(8))}
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
        </Modal.Content>
      </Modal>
    </>
  );
};

export default withTranslation()(ZipFileModal);
