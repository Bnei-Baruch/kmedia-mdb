import pick from 'lodash/pick';
import { getQuery, updateQuery } from './url';
import { physicalFile } from './utils';
import {
  LANG_ENGLISH,
  LANG_HEBREW,
  LANG_RUSSIAN,
  MEDIA_TYPES,
  MIME_TYPE_TO_MEDIA_TYPE,
  MT_AUDIO,
  MT_VIDEO,
  PLAYABLE_MEDIA_TYPES,
} from './consts';

function calcAvailableMediaTypes(contentUnit, language) {
  if (!contentUnit) {
    return [];
  }

  return Array.from((contentUnit.files || []).reduce((acc, file) => {
    if (file.language === language &&
        (file.mimetype === getMimeType(MT_VIDEO) ||
         file.mimetype === getMimeType(MT_AUDIO))) {
      acc.add(MIME_TYPE_TO_MEDIA_TYPE[file.mimetype]);
    }
    return acc;
  }, new Set()));
}

function getMimeType(mediaType) {
  return mediaType === MT_VIDEO ? MEDIA_TYPES.mp4.mime_type : MEDIA_TYPES.mp3.mime_type;
}

/**
 * Calculates available languages for content unit for specific language
 * is language is not provided calculates both video and audio available
 * languages.
 * @param {string|null} mediaType if null will check available languages
 *    for both audio and video.
 * @return {!Array<string>}
 */
function calcAvailableLanguages(contentUnit, mediaType=null) {
  if (!contentUnit) {
    return [];
  }

  const mediaTypes = mediaType ? [mediaType] : [MT_VIDEO, MT_AUDIO];
  const mimeTypes = mediaTypes.map(mt => getMimeType(mt));
  return Array.from((contentUnit.files || []).reduce((acc, file) => {
    if (mediaTypes.includes(file.type) || mimeTypes.includes(file.mimetype)) {
      acc.add(file.language);
    }
    return acc;
  }, new Set()));
}

function playableItem(contentUnit, mediaType, language) {
  if (!contentUnit) {
    return null;
  }

  const allAvailableLanguages = calcAvailableLanguages(contentUnit);
  const requestedLanguage = language;
  // Fallback to English, if not, then to Hebrew (most probably source) then to
  // Russian (second most probable source), then to any other language.
  if (!allAvailableLanguages.includes(language)) {
    const fallbacks = [LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN];
    language = fallbacks.find(f => allAvailableLanguages.includes(f)) ||
      allAvailableLanguages.length && allAvailableLanguages[0];
  }

  const availableMediaTypes = calcAvailableMediaTypes(contentUnit, language);
  const requestedMediaType = mediaType;
  // Fallback to other media type if this one not available.
  if (!availableMediaTypes.includes(mediaType)) {
    if (mediaType === MT_AUDIO) {
      mediaType = MT_VIDEO;
    }
    if (mediaType === MT_VIDEO) {
      mediaType = MT_AUDIO;
    }
  }

  const file = (contentUnit.files || []).find(f =>
      f.language === language && f.mimetype === getMimeType(mediaType));

  return {
    contentUnitId: contentUnit.id,
    language,
    requestedLanguage,
    src: file ? physicalFile(file, true) : '',
    mediaType,
    requestedMediaType,
    availableMediaTypes,
    availableLanguages: allAvailableLanguages,
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
