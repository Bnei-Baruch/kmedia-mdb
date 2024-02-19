import { assetUrl, Requests } from '../../../../../../helpers/Api';
import { physicalFile } from '../../../../../../helpers/utils';

// converts images from server format (path, size) to ImageGallery format
export const imageGalleryItem = item => {
  let src;
  let alt;
  if (item.path) {
    // opened zip file
    src = assetUrl(item.path.substring(8));
    alt = item.path.substring(item.path.lastIndexOf('_') + 1);
  } else {
    // image file
    src = physicalFile(item);
    alt = item.name;
  }

  const thumbSrc = Requests.imaginary('thumbnail', { url: src, width: 100, stripmeta: true });

  return {
    original: src,
    thumbnail: thumbSrc,
    originalAlt: alt,
    thumbnailAlt: `${alt}-thumbnail`,
    thumbnailTitle: `${alt}`,
  };
};

export const isZipFile = file => file.name.endsWith('.zip');
