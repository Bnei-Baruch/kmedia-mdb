import moment from 'moment';

import { MT_VIDEO, MT_AUDIO } from '../../helpers/consts';
import { isEmpty } from '../../helpers/utils';
import { PLAYER_POSITION_STORAGE_KEY } from './constants';

export const DEFAULT_PLAYER_VOLUME = 80;

export const findPlayedFile = (item, info, lang, mt, q) => {
  if (isEmpty(item) || !info.isReady || (!item.files && !item.file)) return {};

  const { mediaType, language, quality } = info;
  const { subtitles }                    = item;
  if (item?.isHLS) {
    const src = `${item.file.src}?no_video=${mediaType === MT_AUDIO}`;
    return { ...item.file, src, type: mediaType, image: item.preImageUrl, subtitles };
  }

  lang = lang || language;
  mt   = mt || mediaType;
  q    = q || quality;

  const { filesByLang, qualityByLang, mtByLang } = item;

  const byLang = filesByLang[lang];

  // Can't find language - take default
  if (!byLang) {
    return findPlayedFile(item, info, Object.keys(filesByLang)[0]);
  }

  // Can't find media type - take other
  if (!mtByLang[lang].includes(mt)) {
    const newMT = (mt === MT_VIDEO) ? MT_AUDIO : MT_VIDEO;
    return findPlayedFile(item, info, lang, newMT);
  }

  // Can't find quality - take first
  if (mt !== MT_AUDIO && !qualityByLang[lang].includes(q)) {
    return findPlayedFile(item, info, lang, mt, qualityByLang[lang][0]);
  }

  const f     = byLang.find(f => f.type === mt && (mt === MT_AUDIO || !f.video_size || f.video_size === q));
  const image = f.type === MT_VIDEO ? item.preImageUrl : null;

  return { ...f, image, subtitles };
};

export const getSavedTime = (cuId, ht) => {
  const json = localStorage.getItem(`${PLAYER_POSITION_STORAGE_KEY}_${cuId}`);
  let lt;
  try {
    lt = JSON.parse(json);
  } catch (e) {
    console.error('broken json', json);
  }

  return lt && (!ht || moment(lt.timestamp).isAfter(ht.timestamp)) ? lt : ht || false;
};
