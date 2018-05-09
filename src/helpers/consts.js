// Collection Types
export const CT_DAILY_LESSON       = 'DAILY_LESSON';
export const CT_SPECIAL_LESSON     = 'SPECIAL_LESSON';
export const CT_FRIENDS_GATHERINGS = 'FRIENDS_GATHERINGS';
export const CT_VIDEO_PROGRAM      = 'VIDEO_PROGRAM';
export const CT_LECTURE_SERIES     = 'LECTURE_SERIES';
export const CT_CHILDREN_LESSONS   = 'CHILDREN_LESSONS';
export const CT_WOMEN_LESSONS      = 'WOMEN_LESSONS';
export const CT_VIRTUAL_LESSONS    = 'VIRTUAL_LESSONS';
export const CT_MEALS              = 'MEALS';
export const CT_CONGRESS           = 'CONGRESS';
export const CT_HOLIDAY            = 'HOLIDAY';
export const CT_PICNIC             = 'PICNIC';
export const CT_UNITY_DAY          = 'UNITY_DAY';
export const CT_CLIPS              = 'CLIPS';
export const CT_ARTICLES           = 'ARTICLES';

// Content Unit Types
export const CT_LESSON_PART           = 'LESSON_PART';
export const CT_LECTURE               = 'LECTURE';
export const CT_CHILDREN_LESSON       = 'CHILDREN_LESSON';
export const CT_WOMEN_LESSON          = 'WOMEN_LESSON';
export const CT_VIRTUAL_LESSON        = 'VIRTUAL_LESSON';
export const CT_FRIENDS_GATHERING     = 'FRIENDS_GATHERING';
export const CT_MEAL                  = 'MEAL';
export const CT_VIDEO_PROGRAM_CHAPTER = 'VIDEO_PROGRAM_CHAPTER';
export const CT_FULL_LESSON           = 'FULL_LESSON';
export const CT_ARTICLE               = 'ARTICLE';
export const CT_UNKNOWN               = 'UNKNOWN';
export const CT_EVENT_PART            = 'EVENT_PART';
export const CT_CLIP                  = 'CLIP';
export const CT_TRAINING              = 'TRAINING';
export const CT_KITEI_MAKOR           = 'KITEI_MAKOR';
export const CT_PUBLICATION           = 'PUBLICATION';
export const CT_LELO_MIKUD            = 'LELO_MIKUD';

// Source Types
export const SRC_COLLECTION = 'COLLECTION';
export const SRC_BOOK       = 'BOOK';
export const SRC_VOLUME     = 'VOLUME';
export const SRC_PART       = 'PART';
export const SRC_PARASHA    = 'PARASHA';
export const SRC_CHAPTER    = 'CHAPTER';
export const SRC_ARTICLE    = 'ARTICLE';
export const SRC_TITLE      = 'TITLE';
export const SRC_LETTER     = 'LETTER';
export const SRC_ITEM       = 'ITEM';

// Languages
export const LANG_HEBREW     = 'he';
export const LANG_ENGLISH    = 'en';
export const LANG_RUSSIAN    = 'ru';
export const LANG_SPANISH    = 'es';
export const LANG_ITALIAN    = 'it';
export const LANG_GERMAN     = 'de';
export const LANG_DUTCH      = 'nl';
export const LANG_FRENCH     = 'fr';
export const LANG_PORTUGUESE = 'pt';
export const LANG_TURKISH    = 'tr';
export const LANG_POLISH     = 'pl';
export const LANG_ARABIC     = 'ar';
export const LANG_HUNGARIAN  = 'hu';
export const LANG_FINNISH    = 'fi';
export const LANG_LITHUANIAN = 'lt';
export const LANG_JAPANESE   = 'ja';
export const LANG_BULGARIAN  = 'bg';
export const LANG_GEORGIAN   = 'ka';
export const LANG_NORWEGIAN  = 'no';
export const LANG_SWEDISH    = 'sv';
export const LANG_CROATIAN   = 'hr';
export const LANG_CHINESE    = 'zh';
export const LANG_PERSIAN    = 'fa';
export const LANG_ROMANIAN   = 'ro';
export const LANG_HINDI      = 'hi';
export const LANG_UKRAINIAN  = 'ua';
export const LANG_MACEDONIAN = 'mk';
export const LANG_SLOVENIAN  = 'sl';
export const LANG_LATVIAN    = 'lv';
export const LANG_SLOVAK     = 'sk';
export const LANG_CZECH      = 'cs';
export const LANG_UNKNOWN    = 'xx';

export const LANGUAGES = {
  [LANG_HEBREW]: { value: LANG_HEBREW, flag: 'il', locale: 'he_IL' },
  [LANG_ENGLISH]: { value: LANG_ENGLISH, flag: 'us', locale: 'en_US' },
  [LANG_RUSSIAN]: { value: LANG_RUSSIAN, flag: 'ru', locale: 'ru_RU' },
  [LANG_SPANISH]: { value: LANG_SPANISH, flag: 'es', locale: 'es_ES' },
  [LANG_ITALIAN]: { value: LANG_ITALIAN, flag: 'it', locale: 'it_IT' },
  [LANG_GERMAN]: { value: LANG_GERMAN, flag: 'de', locale: 'de_DE' },
  [LANG_DUTCH]: { value: LANG_DUTCH, flag: 'nl', locale: 'nl_NL' },
  [LANG_FRENCH]: { value: LANG_FRENCH, flag: 'fr', locale: 'fr_FR' },
  [LANG_PORTUGUESE]: { value: LANG_PORTUGUESE, flag: 'pt', locale: 'pt_PT' },
  [LANG_TURKISH]: { value: LANG_TURKISH, flag: 'tr', locale: 'tr_TR' },
  [LANG_POLISH]: { value: LANG_POLISH, flag: 'pl', locale: 'pl_PL' },
  [LANG_ARABIC]: { value: LANG_ARABIC, flag: 'sa', locale: 'ar_AR' },
  [LANG_HUNGARIAN]: { value: LANG_HUNGARIAN, flag: 'hu', locale: 'hu_HU' },
  [LANG_FINNISH]: { value: LANG_FINNISH, flag: 'fi', locale: 'fi_FI' },
  [LANG_LITHUANIAN]: { value: LANG_LITHUANIAN, flag: 'lt', locale: 'lt_LT' },
  [LANG_JAPANESE]: { value: LANG_JAPANESE, flag: 'jp', locale: 'ja_JP' },
  [LANG_BULGARIAN]: { value: LANG_BULGARIAN, flag: 'bg', locale: 'bg_BG' },
  [LANG_GEORGIAN]: { value: LANG_GEORGIAN, flag: 'ge', locale: 'ka_GE' },
  // TODO: choose from Norwegian Bokmål / Norwegian Nynorsk
  [LANG_NORWEGIAN]: { value: LANG_NORWEGIAN, flag: 'no', locale: 'nb_NO' },
  [LANG_SWEDISH]: { value: LANG_SWEDISH, flag: 'se', locale: 'sv_SE' },
  [LANG_CROATIAN]: { value: LANG_CROATIAN, flag: 'hr', locale: 'hr_HR' },
  [LANG_CHINESE]: { value: LANG_CHINESE, flag: 'cn', locale: 'zh_CN' },
  [LANG_PERSIAN]: { value: LANG_PERSIAN, flag: 'ir', locale: 'fa_IR' },
  [LANG_ROMANIAN]: { value: LANG_ROMANIAN, flag: 'ro', locale: 'ro_RO' },
  [LANG_HINDI]: { value: LANG_HINDI, flag: 'in', locale: 'hi_IN' },
  [LANG_UKRAINIAN]: { value: LANG_UKRAINIAN, flag: 'ua', locale: 'uk_UA' },
  [LANG_MACEDONIAN]: { value: LANG_MACEDONIAN, flag: 'mk', locale: 'mk_MK' },
  [LANG_SLOVENIAN]: { value: LANG_SLOVENIAN, flag: 'si', locale: 'sl_SI' },
  [LANG_LATVIAN]: { value: LANG_LATVIAN, flag: 'lv', locale: 'lv_LV' },
  [LANG_SLOVAK]: { value: LANG_SLOVAK, flag: 'sk', locale: 'sk_SK' },
  [LANG_CZECH]: { value: LANG_CZECH, flag: 'cz', locale: 'cs_CZ' },
};

export const FLAG_TO_LANGUAGE = Object.values(LANGUAGES).reduce((acc, language) => {
  acc[language.flag] = language.value;
  return acc;
}, {});

export const LANGUAGE_TO_LOCALE = Object.values(LANGUAGES).reduce((acc, language) => {
  acc[language.value] = language.locale;
  return acc;
}, {});

export const ALL_LANGUAGES = [
  LANG_HEBREW,
  LANG_ENGLISH,
  LANG_RUSSIAN,
  LANG_SPANISH,
  LANG_ITALIAN,
  LANG_GERMAN,
  LANG_DUTCH,
  LANG_FRENCH,
  LANG_PORTUGUESE,
  LANG_TURKISH,
  LANG_POLISH,
  LANG_ARABIC,
  LANG_HUNGARIAN,
  LANG_FINNISH,
  LANG_LITHUANIAN,
  LANG_JAPANESE,
  LANG_BULGARIAN,
  LANG_GEORGIAN,
  LANG_NORWEGIAN,
  LANG_SWEDISH,
  LANG_CROATIAN,
  LANG_CHINESE,
  LANG_PERSIAN,
  LANG_ROMANIAN,
  LANG_HINDI,
  LANG_UKRAINIAN,
  LANG_MACEDONIAN,
  LANG_SLOVENIAN,
  LANG_LATVIAN,
  LANG_SLOVAK,
  LANG_CZECH,
];

export const DEFAULT_LANGUAGE = LANG_ENGLISH;

export const RTL_LANGUAGES = [
  LANG_HEBREW,
  LANG_ARABIC,
  LANG_PERSIAN,
];

export const LANGUAGE_OPTIONS = ALL_LANGUAGES.map(x => LANGUAGES[x]);

export const MT_VIDEO        = 'video';
export const MT_AUDIO        = 'audio';
export const MT_IMAGE        = 'image';
export const MT_TEXT         = 'text';
export const MT_SHEET        = 'sheet';
export const MT_BANNER       = 'banner';
export const MT_PRESENTATION = 'presentation';

export const PLAYABLE_MEDIA_TYPES = [
  MT_VIDEO, MT_AUDIO
];

export const MEDIA_TYPES = {
  mp4: { type: MT_VIDEO, sub_type: '', mime_type: 'video/mp4' },
  wmv: { type: MT_VIDEO, sub_type: '', mime_type: 'video/x-ms-wmv' },
  flv: { type: MT_VIDEO, sub_type: '', mime_type: 'video/x-flv' },
  mov: { type: MT_VIDEO, sub_type: '', mime_type: 'video/quicktime' },
  asf: { type: MT_VIDEO, sub_type: '', mime_type: 'video/x-ms-asf' },
  mpg: { type: MT_VIDEO, sub_type: '', mime_type: 'video/mpeg' },
  avi: { type: MT_VIDEO, sub_type: '', mime_type: 'video/x-msvideo' },
  mp3: { type: MT_AUDIO, sub_type: '', mime_type: 'audio/mpeg' },
  wma: { type: MT_AUDIO, sub_type: '', mime_type: 'audio/x-ms-wma' },
  mid: { type: MT_AUDIO, sub_type: '', mime_type: 'audio/midi' },
  wav: { type: MT_AUDIO, sub_type: '', mime_type: 'audio/x-wav' },
  aac: { type: MT_AUDIO, sub_type: '', mime_type: 'audio/aac' },
  jpg: { type: MT_IMAGE, sub_type: '', mime_type: 'image/jpeg' },
  gif: { type: MT_IMAGE, sub_type: '', mime_type: 'image/gif' },
  bmp: { type: MT_IMAGE, sub_type: '', mime_type: 'image/bmp' },
  tif: { type: MT_IMAGE, sub_type: '', mime_type: 'image/tiff' },
  zip: { type: MT_IMAGE, sub_type: '', mime_type: 'application/zip' },
  '7z': { type: MT_IMAGE, sub_type: '', mime_type: 'application/x-7z-compressed' },
  rar: { type: MT_IMAGE, sub_type: '', mime_type: 'application/x-rar-compressed' },
  sfk: { type: MT_IMAGE, sub_type: '', mime_type: '' },
  doc: { type: MT_TEXT, sub_type: '', mime_type: 'application/msword' },
  docx: {
    type: MT_TEXT,
    sub_type: '',
    mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  htm: { type: MT_TEXT, sub_type: '', mime_type: 'text/html' },
  html: { type: MT_TEXT, sub_type: '', mime_type: 'text/html' },
  pdf: { type: MT_TEXT, sub_type: '', mime_type: 'application/pdf' },
  epub: { type: MT_TEXT, sub_type: '', mime_type: 'application/epub+zip' },
  rtf: { type: MT_TEXT, sub_type: '', mime_type: 'text/rtf' },
  txt: { type: MT_TEXT, sub_type: '', mime_type: 'text/plain' },
  fb2: { type: MT_TEXT, sub_type: '', mime_type: 'text/xml' },
  rb: { type: MT_TEXT, sub_type: '', mime_type: 'application/x-rocketbook' },
  xls: { type: MT_SHEET, sub_type: '', mime_type: 'application/vnd.ms-excel' },
  swf: { type: MT_BANNER, sub_type: '', mime_type: 'application/x-shockwave-flash' },
  ppt: { type: MT_PRESENTATION, sub_type: '', mime_type: 'application/vnd.ms-powerpoint' },
  pptx: {
    type: MT_PRESENTATION,
    sub_type: '',
    mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  },
  pps: { type: MT_PRESENTATION, sub_type: '', mime_type: 'application/vnd.ms-powerpoint' },
};

export const MIME_TYPE_TO_MEDIA_TYPE = Object.values(MEDIA_TYPES).reduce((acc, mediaInfo) => {
  acc[mediaInfo.mime_type] = mediaInfo.type;
  return acc;
}, {});

export const VS_NHD     = 'nHD';
export const VS_HD      = 'HD';
export const VS_FHD     = 'FHD';
export const VS_DEFAULT = VS_NHD;

export const getVideoRes = (vsType, date) => {
  // date: Date object
  // before 2014 return 360p
  if (date.getFullYear() < 2014) {
    return { width: 480, height: 360 };
  }
  if (vsType === VS_NHD) {
    return { width: 640, height: 360 };
  }
  if (vsType === VS_HD) {
    return { width: 1280, height: 720 };
  }
  // fHD
  return { width: 1920, height: 980 };
};

export const VS_NAMES = {
  [VS_NHD]: '360p',
  [VS_HD]: '720p',
  [VS_FHD]: '1080p',
};

export const TOPICS_FOR_DISPLAY    = ['VUpFlBnu', '0db5BBS3', 'g3ml0jum'];
export const EVENT_PREPARATION_TAG = 'Salvk5yF';

export const DATE_FORMAT = 'YYYY-MM-DD';

export const EVENT_TYPES = [
  CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY
];

// Required for Sections filter.
export const COLLECTION_LESSONS_TYPE      = [CT_DAILY_LESSON, CT_SPECIAL_LESSON, CT_CHILDREN_LESSONS, CT_WOMEN_LESSONS, CT_VIRTUAL_LESSONS];
export const COLLECTION_PROGRAMS_TYPE     = [CT_VIDEO_PROGRAM];
export const COLLECTION_LECTURES_TYPE     = [CT_LECTURE_SERIES];
export const COLLECTION_EVENTS_TYPE       = [CT_FRIENDS_GATHERINGS, CT_MEALS, ...EVENT_TYPES];
export const COLLECTION_PUBLICATIONS_TYPE = [CT_ARTICLES];
export const UNIT_LESSONS_TYPE            = [CT_LESSON_PART, CT_CHILDREN_LESSON, CT_WOMEN_LESSON, CT_VIRTUAL_LESSON, CT_FULL_LESSON];
export const UNIT_PROGRAMS_TYPE           = [CT_VIDEO_PROGRAM_CHAPTER];
export const UNIT_LECTURES_TYPE           = [CT_LECTURE];
export const UNIT_EVENTS_TYPE             = [CT_EVENT_PART, CT_MEAL, CT_FRIENDS_GATHERING];
export const UNIT_PUBLICATIONS_TYPE       = [CT_PUBLICATION];

export const NO_NAME = '☠ no name';

// Sources
export const BS_SHAMATI = 'qMUUn22b';
export const BS_IGROT   = 'DVSS0xAR';
export const BS_TAAS    = 'xtKmrbb9';
export const RB_IGROT   = 'b8SHlrfH';
export const MR_TORA    = 'bvA8ZB1w';
export const RH_ZOHAR   = 'AwGBQX2L';

// This is exptected to be sorted by values
export const BS_TAAS_PARTS = {
  '9xNFLSSp': 1,
  XlukqLH8: 37,
  AerA1hNN: 101,
  '1kDKQxJb': 209,
  o5lXptLo: 291,
  eNwJXy4s: 389,
  ahipVtPu: 485,
  Pscnn3pP: 599,
  Lfu7W3CD: 731,
  n03vXCJl: 865,
  UGcGGSpP: 1011,
  NpLQT0LX: 1127,
  AUArdCkH: 1297,
  tit6XNAo: 1493,
  FaKUG7ru: 1687,
  mW6eON0z: 1887,
};

export const COOKIE_UI_LANG = 'archive_UIlang';
export const LANG_UI_LANGUAGES = [LANG_HEBREW, LANG_ENGLISH, LANG_RUSSIAN, LANG_SPANISH, LANG_UKRAINIAN];
