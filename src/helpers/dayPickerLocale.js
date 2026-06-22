// Maps the app UI language code (keys of LANGUAGES in consts.js) to a date-fns
// Locale object. react-day-picker v10 expects a Locale object for its `locale`
// prop — passing a string is silently ignored and the calendar falls back to enUS.
import {
  ar, az, bg, cs, da, de, el, enUS, es, et, faIR, fi, fr, he, hi, hr, hu, hy,
  id, it, ja, ka, lt, lv, mk, nb, nl, pl, pt, ro, ru, sl, sv, tr, uk, zhCN,
} from 'react-day-picker/locale';

import {
  LANG_AMHARIC, LANG_ARABIC, LANG_ARMENIAN, LANG_AZERBAIJANI, LANG_BULGARIAN,
  LANG_CHINESE, LANG_CROATIAN, LANG_CZECH, LANG_DANISH, LANG_DUTCH, LANG_ENGLISH,
  LANG_ESTONIAN, LANG_FINNISH, LANG_FRENCH, LANG_GEORGIAN, LANG_GERMAN, LANG_GREEK,
  LANG_HEBREW, LANG_HINDI, LANG_HUNGARIAN, LANG_INDONESIAN, LANG_ITALIAN,
  LANG_JAPANESE, LANG_LATVIAN, LANG_LITHUANIAN, LANG_MACEDONIAN, LANG_NORWEGIAN,
  LANG_ORIGINAL, LANG_PERSIAN, LANG_POLISH, LANG_PORTUGUESE, LANG_ROMANIAN,
  LANG_RUSSIAN, LANG_SLOVENIAN, LANG_SPANISH, LANG_SWEDISH, LANG_TAGALOG,
  LANG_TURKISH, LANG_UKRAINIAN,
} from './consts';

const DAY_PICKER_LOCALES = {
  [LANG_HEBREW]    : he,
  [LANG_ENGLISH]   : enUS,
  [LANG_RUSSIAN]   : ru,
  [LANG_SPANISH]   : es,
  [LANG_ITALIAN]   : it,
  [LANG_GERMAN]    : de,
  [LANG_DUTCH]     : nl,
  [LANG_FRENCH]    : fr,
  [LANG_PORTUGUESE]: pt,
  [LANG_TURKISH]   : tr,
  [LANG_POLISH]    : pl,
  [LANG_ARABIC]    : ar,
  [LANG_HUNGARIAN] : hu,
  [LANG_FINNISH]   : fi,
  [LANG_LITHUANIAN]: lt,
  [LANG_JAPANESE]  : ja,
  [LANG_BULGARIAN] : bg,
  [LANG_GEORGIAN]  : ka,
  [LANG_NORWEGIAN] : nb,
  [LANG_SWEDISH]   : sv,
  [LANG_CROATIAN]  : hr,
  [LANG_CHINESE]   : zhCN,
  [LANG_PERSIAN]   : faIR,
  [LANG_ROMANIAN]  : ro,
  [LANG_HINDI]     : hi,
  [LANG_UKRAINIAN] : uk,
  [LANG_MACEDONIAN]: mk,
  [LANG_SLOVENIAN] : sl,
  [LANG_LATVIAN]   : lv,
  [LANG_CZECH]     : cs,
  [LANG_INDONESIAN]: id,
  [LANG_ARMENIAN]  : hy,
  [LANG_DANISH]    : da,
  [LANG_ESTONIAN]  : et,
  [LANG_GREEK]     : el,
  [LANG_AZERBAIJANI]: az,
  [LANG_ORIGINAL]  : he,
  // No date-fns locale available — fall back to enUS:
  [LANG_AMHARIC]   : enUS,
  [LANG_TAGALOG]   : enUS,
};

export const getDayPickerLocale = language => DAY_PICKER_LOCALES[language] || enUS;
