import moment from 'moment';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';

import { assetUrl } from './Api';
import {
  CT_FULL_LESSON,
  CT_LESSON_PART,
  EVENT_PREPARATION_TAG,
  EVENT_TYPES,
  LANG_ENGLISH,
  LANG_HEBREW,
  LANG_RUSSIAN,
  LANG_UNKNOWN,
  MT_AUDIO,
  MT_VIDEO,
  VS_DEFAULT,
} from './consts';
import { getQuery, updateQuery } from './url';
import { canonicalLink } from './links';
import MediaHelper from './media';
import { isEmpty, physicalFile } from './utils';

const fallbacksLanguages = [LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN];

function restorePreferredMediaType() {
  return localStorage.getItem('@@kmedia_player_media_type') || MT_VIDEO;
}

function persistPreferredMediaType(value) {
  localStorage.setItem('@@kmedia_player_media_type', value);
}

function restorePreferredVideoSize() {
  return localStorage.getItem('@@kmedia_player_video_size') || VS_DEFAULT;
}

function persistPreferredVideoSize(value) {
  localStorage.setItem('@@kmedia_player_video_size', value);
}

function isPlayable(file) {
  return MediaHelper.IsMp4(file) || MediaHelper.IsMp3(file);
}

function calcAvailableMediaTypes(unit, language) {
  if (!unit || !Array.isArray(unit.files)) {
    return [];
  }

  return Array.from(unit.files.reduce((acc, val) => {
    if (val.language === language && isPlayable(val)) {
      acc.add(val.type);
    }
    return acc;
  }, new Set()));
}

function calcAvailableLanguages(unit) {
  if (!unit || !Array.isArray(unit.files)) {
    return [];
  }

  return Array.from(unit.files.reduce((acc, val) => {
    if (isPlayable(val)) {
      acc.add(val.language);
    }
    return acc;
  }, new Set()));
}

function playableItem(unit, mediaType, language) {
  if (!unit) {
    return null;
  }

  const availableLanguages = calcAvailableLanguages(unit);
  const requestedLanguage  = language;
  // Fallback to English, if not, then to Hebrew (most probably source) then to
  // Russian (second most probable source), then to any other language.
  if (!availableLanguages.includes(language)) {
    language = fallbacksLanguages.find(f => availableLanguages.includes(f)) ||
      (availableLanguages.length && availableLanguages[0]) ||
      LANG_UNKNOWN;
  }

  const availableMediaTypes = calcAvailableMediaTypes(unit, language);
  const requestedMediaType  = mediaType;
  // Fallback to other media type if this one not available.
  if (!availableMediaTypes.includes(mediaType)) {
    if (mediaType === MT_AUDIO) {
      mediaType = MT_VIDEO;
    } else if (mediaType === MT_VIDEO) {
      mediaType = MT_AUDIO;
    }
  }

  const files     = (unit.files || []).filter(f => (
    f.language === language &&
    (mediaType === MT_VIDEO ? MediaHelper.IsMp4(f) : MediaHelper.IsMp3(f))));
  const byQuality = mapValues(groupBy(files, x => x.video_size || VS_DEFAULT),
    val => physicalFile(val[0], true));

  return {
    unit,
    language,
    mediaType,
    src: byQuality[VS_DEFAULT] || '',
    preImageUrl: assetUrl(`api/thumbnail/${unit.id}`),
    requestedLanguage,
    requestedMediaType,
    availableLanguages,
    availableMediaTypes,
    byQuality,
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

  const shareUrl = canonicalLink(collection);
  items.forEach((x) => {
    x.shareUrl = shareUrl;
  }); // eslint-disable-line no-param-reassign

  return {
    collection,
    language,
    mediaType,
    items,
    groups,
  };
}

function getMediaTypeFromQuery(location, defaultMediaType) {
  const query = getQuery(location);
  const mt    = (query.mediaType || '').toLowerCase();
  return mt === MT_VIDEO || mt === MT_AUDIO ? mt : defaultMediaType;
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
  restorePreferredVideoSize,
  persistPreferredVideoSize,
};
