import moment from 'moment';

import { assetUrl } from './Api';
import {
  CT_FULL_LESSON,
  CT_LESSON_PART,
  EVENT_PREPARATION_TAG,
  EVENT_TYPES,
  MT_AUDIO,
  MT_VIDEO,
  VS_DEFAULT,
  VS_HLS,
  MT_SUBTITLES
} from './consts';
import { getQuery } from './url';
import MediaHelper from './media';
import { isEmpty, physicalFile } from './utils';

const restorePreferredMediaType = () => localStorage.getItem('@@kmedia_player_media_type') || MT_VIDEO;

export const persistPreferredMediaType = value => localStorage.setItem('@@kmedia_player_media_type', value);

const isPlayable = file => MediaHelper.IsMp4(file) || MediaHelper.IsMp3(file);

const findHLS = files => files.find(f => f.video_size === VS_HLS && f.hls_languages && f.video_qualities);

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

export const calcAvailableLanguages = unit => {
  if (!unit || !Array.isArray(unit.files)) {
    return [];
  }

  return Array.from(
    unit.files
      .filter(f => f.type === MT_VIDEO || f.type === MT_AUDIO)
      .reduce((acc, val) => acc.add(val.language), new Set())
  );
};

export const playableItem = (unit, preImageUrl) => {
  if (!preImageUrl) {
    preImageUrl = assetUrl(`api/thumbnail/${unit.id}`);
  }

  const resp = {
    id           : unit.id,
    name         : unit.name,
    properties   : unit.properties,
    preImageUrl,
    mtByLang     : {},
    qualityByLang: {}
  };
  if (!unit?.files) return resp;

  let subtitles = unit.files.filter(f => f.type === MT_SUBTITLES).map(f => ({
    src     : physicalFile(f),
    language: f.language
  })) || [];

  if (typeof window !== 'undefined' && window.location.search.includes('subs=srt')) {
    subtitles = [{
      src     : '/.well-known/result.srt',
      language: 'he'
    }];
  }
  if (typeof window !== 'undefined' && window.location.search.includes('subs=wlevel')) {
    subtitles = [{
      src     : '/.well-known/result_wlevel.srt',
      language: 'he'
    }];
  }
  const hls = findHLS(unit.files);
  if (hls) {
    return {
      ...resp,
      file     : { ...hls, src: physicalFile(hls, true) },
      isHLS    : true,
      languages: hls.hls_languages,
      qualities: hls.video_qualities,
      subtitles
    };
  }

  const languages = calcAvailableLanguages(unit);
  if (languages.length === 0) {
    return {};
  }

  const mtByLang = languages.reduce((acc, l) => ({ ...acc, [l]: calcAvailableMediaTypes(unit, l) }), {});

  const files         = unit.files.filter(isPlayable).map(f => ({ ...f, src: physicalFile(f, true) }));
  const filesByLang   = languages.reduce((acc, l) => (
    { ...acc, [l]: files.filter(f => f.language === l) }
  ), {});
  const qualityByLang = languages.reduce((acc, l) => {
    const qs = filesByLang[l].filter(f => f.type === MT_VIDEO).map(f => f.video_size || VS_DEFAULT);
    if (qs.length === 0) return acc;
    return { ...acc, [l]: qs };
  }, {});

  return {
    ...resp,
    languages,
    mtByLang,
    filesByLang,
    qualityByLang,
    files,
    subtitles
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
    units.sort((a, b) => new Date(b.film_date) - new Date(a.film_date));
    items = units.map(x => playableItem(x));
  }

  // don't include items without unit
  items = items.filter(item => item?.id);
  return { items, name };
};

//query utilities
export const getMediaTypeFromQuery = location => {
  const query   = getQuery(location || window?.location);
  let mediaType = query?.mediaType || '';
  if (Array.isArray(mediaType)) {
    mediaType = mediaType.pop();
  }

  const mt = mediaType.toLowerCase();

  return [MT_VIDEO, MT_AUDIO].includes(mt) ? mt : restorePreferredMediaType();
};

export const getLanguageFromQuery = location => {
  const query = getQuery(location);
  return query.shareLang || query.language || '';
};

export const getActivePartFromQuery = (location, def = 0) => {
  const q = getQuery(location);
  const p = q.ap ? parseInt(q.ap, 10) : def;
  return Number.isNaN(p) || p < 0 ? def : p;
};

export const EMBED_TYPE_PLAYER   = 'player';
export const EMBED_TYPE_PLAYLIST = 'playlist';

const EMBED_TYPE = {
  '1': EMBED_TYPE_PLAYER,
  '2': EMBED_TYPE_PLAYLIST
};

export const EMBED_INDEX_BY_TYPE = {
  [EMBED_TYPE_PLAYER]  : 1,
  [EMBED_TYPE_PLAYLIST]: 2
};

export const getEmbedFromQuery = location => {
  const query = getQuery(location);
  const type  = EMBED_TYPE[query.embed];
  return { embed: !!type, type };
};
