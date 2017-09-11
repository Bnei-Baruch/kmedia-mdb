import { MIME_TYPE_TO_MEDIA_TYPE } from './consts';
import { physicalFile } from './utils';

function availableMediaTypes(contentUnit, language) {
  if (!contentUnit) {
    return [];
  }

  return Array.from((contentUnit.files || []).reduce((acc, file) => {
    if (file.language === language) {
      acc.add(MIME_TYPE_TO_MEDIA_TYPE[file.mimetype]);
    }
    return acc;
  }, new Set()));
}

function availableLanguages(contentUnit, mediaType) {
  if (!contentUnit) {
    return [];
  }

  return Array.from((contentUnit.files || []).reduce((acc, file) => {
    if (file.type === mediaType || MIME_TYPE_TO_MEDIA_TYPE[file.mimetype] === mediaType) {
      acc.add(file.language);
    }
    return acc;
  }, new Set()));
}

function playableItem(contentUnit, mediaType, language) {
  if (!contentUnit) {
    return null;
  }

  const file = (contentUnit.files || []).find(
    f => f.language === language && (f.type === mediaType || MIME_TYPE_TO_MEDIA_TYPE[f.mimetype] === mediaType)
  );

  return {
    contentUnitId: contentUnit.id,
    language,
    src: file ? physicalFile(file, true) : '',
    mediaType,
    availableMediaTypes: availableMediaTypes(contentUnit, language),
    availableLanguages: availableLanguages(contentUnit, mediaType)
  };
}

export default {
  playableItem,
  availableMediaTypes
};
