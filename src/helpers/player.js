import moment from 'moment';

import { assetUrl } from './Api';
import {
  CT_FULL_LESSON,
  CT_LESSON_PART,
  EVENT_PREPARATION_TAG,
  EVENT_TYPES,
  LANG_ENGLISH,
  MT_AUDIO,
  MT_VIDEO,
  VS_DEFAULT,
} from './consts';
import { getQuery, updateQuery } from './url';
import MediaHelper from './media';
import { isEmpty, physicalFile } from './utils';

const restorePreferredMediaType = () => localStorage.getItem('@@kmedia_player_media_type') || MT_VIDEO;

export const persistPreferredMediaType = value => localStorage.setItem('@@kmedia_player_media_type', value);

const isPlayable = file => MediaHelper.IsMp4(file) || MediaHelper.IsMp3(file);

const calcAvailableMediaTypes = (unit, language) => {
  if (!unit || !Array.isArray(unit.files)) {
    return [];
  }

  return Array.from(unit.files.reduce((acc, val) => {
    if (val.language === language && isPlayable(val)) {
      acc.add(val.type);
    }

    return acc;
  }, new Set()));
};

const calcAvailableLanguages = unit => {
  if (!unit || !Array.isArray(unit.files)) {
    return [];
  }

  return Array.from(
    unit.files.filter(f => f.type === MT_VIDEO || f.type === MT_AUDIO).reduce((acc, val) => acc.add(val.language),
      new Set()));
};

export const playableItem = (unit, preImageUrl) => {
  if (!unit) {
    return {};
  }

  const languages = calcAvailableLanguages(unit);
  if (languages.length === 0) {
    return {};
  }

  const mtByLang = languages.reduce((acc, l) => ({ ...acc, [l]: calcAvailableMediaTypes(unit, l) }), {});

  const files         = (unit.files || []).filter(isPlayable).map(f => ({ ...f, src: physicalFile(f, true) }));
  const filesByLang   = languages.reduce((acc, l) => (
    { ...acc, [l]: files.filter(f => f.language === l) }
  ), {});
  const qualityByLang = languages.reduce((acc, l) => {
    const qs = filesByLang[l].filter(f => f.type === MT_VIDEO).map(f => f.video_size || VS_DEFAULT);
    if (qs.length === 0) return acc;
    return { ...acc, [l]: qs };
  }, {});
  if (!preImageUrl) {
    preImageUrl = assetUrl(`api/thumbnail/${unit.id}`);
  }
  return {
    id: unit.id,
    languages,
    mtByLang,
    filesByLang,
    qualityByLang,
    files,
    preImageUrl,
  };
};

export const playlist = collection => {
  if (!collection) {
    return {};
  }

  const { content_units: units = [], name, content_type } = collection;

  let items;
  if (EVENT_TYPES.indexOf(content_type) !== -1) {
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

      const v = acc[k] || [];
      v.push(playableItem(val));
      acc[k] = v;
      return acc;
    }, {});

    items = ['lessons', 'other_parts', 'preparation', 'appendices'].reduce((acc, val) => {
      const v = breakdown[val];
      if (isEmpty(v)) {
        return acc;
      }

      return acc.concat(v);
    }, []);
  } else {
    items = units.map(x => playableItem(x));
  }

  // don't include items without unit
  items = items.filter(item => item?.id);
  return { items, name };
};

//query utilities
export const getMediaTypeFromQuery = (location) => {
  const query = getQuery(location || window?.location);
  const mt    = (query.mediaType || '').toLowerCase();

  return [MT_VIDEO, MT_AUDIO].includes(mt) ? mt : restorePreferredMediaType();
};

export const setMediaTypeInQuery = (navigate, location, mediaType = MT_VIDEO) =>
  updateQuery(navigate, location, query => ({ ...query, mediaType }));

export const getLanguageFromQuery = (location, fallbackLanguage = LANG_ENGLISH) => {
  const query    = getQuery(location);
  const language = query.language || fallbackLanguage || LANG_ENGLISH;
  return language.toLowerCase();
};

export const setLanguageInQuery = (navigate, location, language) =>
  updateQuery(navigate, location, query => ({ ...query, language }));

export const getActivePartFromQuery = (location, def = 0) => {
  const q = getQuery(location);
  const p = q.ap ? parseInt(q.ap, 10) : def;
  return Number.isNaN(p) || p < 0 ? def : p;
};

export const getEmbedFromQuery = location => {
  const query = getQuery(location);
  return query.embed === '1';
};
