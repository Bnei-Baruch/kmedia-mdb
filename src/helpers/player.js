import moment from 'moment/moment';

import { assetUrl } from './Api';
import {
  CT_FULL_LESSON,
  CT_LESSON_PART,
  EVENT_PREPARATION_TAG,
  EVENT_TYPES,
  LANG_ENGLISH,
  LANG_HEBREW,
  LANG_RUSSIAN,
  MEDIA_TYPES,
  MIME_TYPE_TO_MEDIA_TYPE,
  MT_AUDIO,
  MT_VIDEO,
  PLAYABLE_MEDIA_TYPES,
} from './consts';
import { getQuery, updateQuery } from './url';
import { isEmpty, physicalFile } from './utils';

function getMimeType(mediaType) {
  return mediaType === MT_VIDEO ? MEDIA_TYPES.mp4.mime_type : MEDIA_TYPES.mp3.mime_type;
}

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

function restorePreferredMediaType() {
  return localStorage.getItem('@@kmedia_player_media_type') || MT_VIDEO;
}

function persistPreferredMediaType(mediaType) {
  localStorage.setItem('@@kmedia_player_media_type', mediaType);
}

/**
 * Calculates available languages for content unit for specific language
 * is language is not provided calculates both video and audio available
 * languages.
 * @param {object} contentUnit
 * @param {string|null} mediaType if null will check available languages
 *    for both audio and video.
 * @return {!Array<string>}
 */
function calcAvailableLanguages(contentUnit, mediaType = null) {
  if (!contentUnit) {
    return [];
  }

  const mediaTypes = mediaType ? [mediaType] : [MT_VIDEO, MT_AUDIO];
  const mimeTypes  = mediaTypes.map(mt => getMimeType(mt));
  return Array.from((contentUnit.files || []).reduce((acc, file) => {
    if (mediaTypes.includes(file.type) || mimeTypes.includes(file.mimetype)) {
      acc.add(file.language);
    }
    return acc;
  }, new Set()));
}

function playableItem(unit, mediaType, language) {
  if (!unit) {
    return null;
  }

  const allAvailableLanguages = calcAvailableLanguages(unit);
  const requestedLanguage     = language;
  // Fallback to English, if not, then to Hebrew (most probably source) then to
  // Russian (second most probable source), then to any other language.
  if (!allAvailableLanguages.includes(language)) {
    const fallbacks = [LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN];
    language        = fallbacks.find(f => allAvailableLanguages.includes(f)) ||
      (allAvailableLanguages.length && allAvailableLanguages[0]);
  }

  const availableMediaTypes = calcAvailableMediaTypes(unit, language);
  const requestedMediaType  = mediaType;
  // Fallback to other media type if this one not available.
  if (!availableMediaTypes.includes(mediaType)) {
    if (mediaType === MT_AUDIO) {
      mediaType = MT_VIDEO;
    }
    if (mediaType === MT_VIDEO) {
      mediaType = MT_AUDIO;
    }
  }

  const file = (unit.files || []).find(f =>
    f.language === language && f.mimetype === getMimeType(mediaType));

  return {
    unit,
    language,
    requestedLanguage,
    src: file ? physicalFile(file, true) : '',
    preImageUrl: assetUrl(`api/thumbnail/${unit.id}`),
    mediaType,
    requestedMediaType,
    availableMediaTypes,
    availableLanguages: allAvailableLanguages,
  };
}

function playlist(collection, mediaType, language) {
  if (!collection) {
    return null;
  }

  const units = collection.content_units || [];

  let items;
  let groups = null;
  if (EVENT_TYPES.indexOf(collection.content_type) !== -1) {
    const { start_date: sDate, end_date: eDate } = collection;
    const mSDate                                 = moment(sDate);
    const mEDate                                 = moment(eDate);

    const breakdown = units.reduce((acc, val) => {
      const fDate = moment(val.film_date);

      let k;
      if (fDate.isBefore(mSDate)) {
        k = 'preparation';
      } else if (fDate.isAfter(mEDate)) {
        k = 'appendices';
      } else if (val.content_type === CT_LESSON_PART || val.content_type === CT_FULL_LESSON) {
        k = 'lessons';

        // fix for daily lessons in same day as event
        // this is necessary as we don't have film_date resolution in hours.
        if (Array.isArray(val.tags) && val.tags.indexOf(EVENT_PREPARATION_TAG) !== -1) {
          k = 'preparation';
        }
      } else {
        k = 'other_parts';
      }

      let v = acc[k];
      if (!v) {
        v = [];
      }
      v.push(playableItem(val, mediaType, language));
      acc[k] = v;
      return acc;
    }, {});

    // We better of sort things in the server...

    // Object.values(breakdown).forEach(x => x.sort((a, b) => {
    //   const fdCmp = strCmp(a.unit.film_date, b.unit.film_date);
    //   if (fdCmp !== 0) {
    //     return fdCmp;
    //   }
    //
    //   // same film_date, try by ccuName
    //   let aCcu = Object.keys(a.unit.collections || {}).find(x => x.startsWith(collection.id));
    //   let bCcu = Object.keys(b.unit.collections || {}).find(x => x.startsWith(collection.id));
    //
    //   console.log('aCcu, bCcu', aCcu, bCcu);
    //
    //   return strCmp(aCcu, bCcu);
    // }));

    let offset = 0;
    groups     = {};
    items      = ['lessons', 'other_parts', 'preparation', 'appendices'].reduce((acc, val) => {
      const v = breakdown[val];
      if (isEmpty(v)) {
        return acc;
      }

      groups[val] = [offset, v.length];
      offset += v.length;

      return acc.concat(v);
    }, []);

  } else {
    items = units.map(x => playableItem(x, mediaType, language));
  }

  return {
    collection,
    language,
    mediaType,
    items,
    groups,
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

function getLanguageFromQuery(location, fallbackLanguage = LANG_ENGLISH) {
  const query    = getQuery(location);
  const language = query.language || fallbackLanguage;
  return language.toLowerCase();
}

function setLanguageInQuery(history, language) {
  updateQuery(history, query => ({
    ...query,
    language
  }));
}

function getActivePartFromQuery(location) {
  const q = getQuery(location);
  const p = q.ap ? parseInt(q.ap, 10) : 0;
  return Number.isNaN(p) || p < 0 ? 0 : p;
}

function setActivePartInQuery(history, ap) {
  updateQuery(history, query => ({
    ...query,
    ap
  }));
}

export default {
  playableItem,
  playlist,
  getMediaTypeFromQuery,
  setMediaTypeInQuery,
  getLanguageFromQuery,
  setLanguageInQuery,
  getActivePartFromQuery,
  setActivePartInQuery,
  restorePreferredMediaType,
  persistPreferredMediaType,
};
