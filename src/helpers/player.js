import pick from 'lodash/pick';
import { getQuery, updateQuery } from './url';
import { MIME_TYPE_TO_MEDIA_TYPE, PLAYABLE_MEDIA_TYPES, MT_VIDEO } from './consts';
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
    availableLanguages: availableLanguages(contentUnit, mediaType),
    ...pick(contentUnit, 'content_type', 'film_date', 'name', 'duration')
  };
}

function playlist(collection, mediaType, language) {
  if (!collection) {
    return null;
  }

  const items = (collection.content_units || []).map(contentUnit => playableItem(contentUnit, mediaType, language));

  return {
    collectionId: collection.id,
    language,
    mediaType,
    items,
    ...pick(collection, 'content_type', 'film_date')
  };
}

function getMediaTypeFromQuery(location, defaultMediaType = MT_VIDEO) {
  const query = getQuery(location);
  return PLAYABLE_MEDIA_TYPES.find(media => media === (query.mediaType || '').toLowerCase()) || defaultMediaType;
}

function setMediaTypeInQuery(history, mediaType = MT_VIDEO) {
  updateQuery(history, query => ({
    ...query,
    mediaType
  }));
}

export default {
  playableItem,
  playlist,
  getMediaTypeFromQuery,
  setMediaTypeInQuery
};
