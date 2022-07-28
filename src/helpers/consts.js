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
export const CT_LESSONS_SERIES     = 'LESSONS_SERIES';
export const CT_SONGS              = 'SONGS';
export const CT_SOURCE             = 'SOURCE';
export const CT_TAG                = 'TAG';

export const CT_COLLECTIONS = [
  CT_DAILY_LESSON,
  CT_SPECIAL_LESSON,
  CT_FRIENDS_GATHERINGS,
  CT_VIDEO_PROGRAM,
  CT_LECTURE_SERIES,
  CT_CHILDREN_LESSONS,
  CT_WOMEN_LESSONS,
  CT_VIRTUAL_LESSONS,
  CT_MEALS,
  CT_CONGRESS,
  CT_HOLIDAY,
  CT_PICNIC,
  CT_UNITY_DAY,
  CT_CLIPS,
  CT_ARTICLES,
  CT_LESSONS_SERIES,
];

export const IsCollectionContentType = contentType => CT_COLLECTIONS.includes(contentType);

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
export const CT_BLOG_POST             = 'BLOG_POST';
export const CT_RESEARCH_MATERIAL     = 'RESEARCH_MATERIAL';
export const CT_KTAIM_NIVCHARIM       = 'KTAIM_NIVCHARIM';
export const CT_LIKUTIM               = 'LIKUTIM';

export const CT_UNITS = [
  CT_LESSON_PART,
  CT_LECTURE,
  CT_CHILDREN_LESSON,
  CT_WOMEN_LESSON,
  CT_VIRTUAL_LESSON,
  CT_FRIENDS_GATHERING,
  CT_MEAL,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_FULL_LESSON,
  CT_ARTICLE,
  CT_UNKNOWN,
  CT_EVENT_PART,
  CT_CLIP,
  CT_TRAINING,
  CT_KITEI_MAKOR,
  CT_PUBLICATION,
  CT_LELO_MIKUD,
  CT_BLOG_POST,
  CT_RESEARCH_MATERIAL,
  CT_KTAIM_NIVCHARIM,
  CT_LIKUTIM,
];

export const iconByContentTypeMap = new Map([
  [CT_LESSON_PART, 'lessons'],
  [CT_FULL_LESSON, 'lessons'],
  [CT_VIRTUAL_LESSON, 'lessons'],
  [CT_WOMEN_LESSON, 'lessons'],
  [CT_CHILDREN_LESSON, 'lessons'],
  [CT_LELO_MIKUD, 'lessons'],
  [CT_DAILY_LESSON, 'lessons'],
  [CT_SPECIAL_LESSON, 'lessons'],
  [CT_LECTURE_SERIES, 'lessons'],
  [CT_CHILDREN_LESSONS, 'lessons'],
  [CT_WOMEN_LESSONS, 'lessons'],
  [CT_VIRTUAL_LESSONS, 'lessons'],
  [CT_LESSONS_SERIES, 'lessons'],
  [CT_LECTURE, 'lessons'],
  [CT_LIKUTIM, 'likutim'],
  [CT_FRIENDS_GATHERING, 'events'],
  [CT_MEAL, 'events'],
  [CT_EVENT_PART, 'events'],
  [CT_TRAINING, 'events'],
  [CT_UNITY_DAY, 'events'],
  [CT_FRIENDS_GATHERINGS, 'events'],
  [CT_CONGRESS, 'events'],
  [CT_MEALS, 'events'],
  [CT_HOLIDAY, 'events'],
  [CT_PICNIC, 'events'],
  [CT_ARTICLE, 'publications'],
  [CT_ARTICLES, 'publications'],
  [CT_BLOG_POST, 'publications'],
  [CT_VIDEO_PROGRAM_CHAPTER, 'programs'],
  [CT_CLIP, 'programs'],
  [CT_VIDEO_PROGRAM, 'programs'],
  [CT_CLIPS, 'programs'],
  [CT_SOURCE, 'sources'],
  [CT_PUBLICATION, 'publications'],
  ['sources', 'sources'],
]);

export const IsUnitContentType = contentType => CT_UNITS.includes(contentType);

// Content types for additional Elastic results
export const SCT_BLOG_POST = 'R_BLOG_POST';
export const SCT_TWEET     = 'R_TWEET';

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
export const LANG_AMHARIC    = 'am';
export const LANG_INDONESIAN = 'id';
export const LANG_ARMENIAN   = 'hy';
export const LANG_UNKNOWN    = 'xx';

export const LANGUAGES = {
  [LANG_HEBREW]: { value: LANG_HEBREW, locale: 'he_IL', lang3: 'HEB', name: 'עברית' },
  [LANG_ENGLISH]: { value: LANG_ENGLISH, locale: 'en_US', lang3: 'ENG', name: 'English' },
  [LANG_RUSSIAN]: { value: LANG_RUSSIAN, locale: 'ru_RU', lang3: 'RUS', name: 'Русский' },
  [LANG_SPANISH]: { value: LANG_SPANISH, locale: 'es_ES', lang3: 'SPA', name: 'Español' },
  [LANG_ITALIAN]: { value: LANG_ITALIAN, locale: 'it_IT', lang3: 'ITA', name: 'Italiano' },
  [LANG_GERMAN]: { value: LANG_GERMAN, locale: 'de_DE', lang3: 'GER', name: 'Deutsch' },
  [LANG_DUTCH]: { value: LANG_DUTCH, locale: 'nl_NL', lang3: 'DUT', name: 'Nederlands' },
  [LANG_FRENCH]: { value: LANG_FRENCH, locale: 'fr_FR', lang3: 'FRE', name: 'Français' },
  [LANG_PORTUGUESE]: { value: LANG_PORTUGUESE, locale: 'pt_PT', lang3: 'POR', name: 'Português' },
  [LANG_TURKISH]: { value: LANG_TURKISH, locale: 'tr_TR', lang3: 'TRK', name: 'Türkçe' },
  [LANG_POLISH]: { value: LANG_POLISH, locale: 'pl_PL', lang3: 'POL', name: 'Polski' },
  [LANG_ARABIC]: { value: LANG_ARABIC, locale: 'ar_AR', lang3: 'ARA', name: 'اَلْعَرَبِيَّةُ' },
  [LANG_HUNGARIAN]: { value: LANG_HUNGARIAN, locale: 'hu_HU', lang3: 'HUN', name: 'Magyar' },
  [LANG_FINNISH]: { value: LANG_FINNISH, locale: 'fi_FI', lang3: 'FIN', name: 'Suo̯mi' },
  [LANG_LITHUANIAN]: { value: LANG_LITHUANIAN, locale: 'lt_LT', lang3: 'LIT', name: 'Lietuvių' },
  [LANG_JAPANESE]: { value: LANG_JAPANESE, locale: 'ja_JP', lang3: 'JPN', name: '日本語' },
  [LANG_BULGARIAN]: { value: LANG_BULGARIAN, locale: 'bg_BG', lang3: 'BUL', name: 'Български' },
  [LANG_GEORGIAN]: { value: LANG_GEORGIAN, locale: 'ka_GE', lang3: 'GEO', name: 'ქართული' },
  // TODO: choose from Norwegian Bokmål / Norwegian Nynorsk
  [LANG_NORWEGIAN]: { value: LANG_NORWEGIAN, locale: 'nb_NO', lang3: 'NOT', name: 'Norsk' },
  [LANG_SWEDISH]: { value: LANG_SWEDISH, locale: 'sv_SE', lang3: 'SWE', name: 'Svenska' },
  [LANG_CROATIAN]: { value: LANG_CROATIAN, locale: 'hr_HR', lang3: 'HRV', name: 'Hrvatski' },
  [LANG_CHINESE]: { value: LANG_CHINESE, locale: 'zh_CN', lang3: 'CHN', name: '中文' },
  [LANG_PERSIAN]: { value: LANG_PERSIAN, locale: 'fa_IR', lang3: 'PER', name: 'کبالا فارسی' },
  [LANG_ROMANIAN]: { value: LANG_ROMANIAN, locale: 'ro_RO', lang3: 'RON', name: 'Românește' },
  [LANG_HINDI]: { value: LANG_HINDI, locale: 'hi_IN', lang3: 'HIN', name: 'हिन्दी' },
  [LANG_UKRAINIAN]: { value: LANG_UKRAINIAN, locale: 'uk_UA', lang3: 'UKR', name: 'Українська' },
  [LANG_MACEDONIAN]: { value: LANG_MACEDONIAN, locale: 'mk_MK', lang3: 'MKD', name: 'Македонски' },
  [LANG_SLOVENIAN]: { value: LANG_SLOVENIAN, locale: 'sl_SI', lang3: 'SLV', name: 'Slovenščina' },
  [LANG_LATVIAN]: { value: LANG_LATVIAN, locale: 'lv_LV', lang3: 'LAV', name: 'Latviešu' },
  [LANG_SLOVAK]: { value: LANG_SLOVAK, locale: 'sk_SK', lang3: 'SLK', name: 'slovenčina' },
  [LANG_CZECH]: { value: LANG_CZECH, locale: 'cs_CZ', lang3: 'CZE', name: 'Čeština' },
  [LANG_AMHARIC]: { value: LANG_AMHARIC, locale: 'am_ET', lang3: 'AMH', name: 'ኣማርኛ' },
  [LANG_INDONESIAN]: { value: LANG_INDONESIAN, locale: 'in_ID', lang3: 'IND', name: 'Bahasa Indonesia' },
  [LANG_ARMENIAN]: { value: LANG_ARMENIAN, locale: 'hy_AM', lang3: 'ARM', name: 'Հայերէն' },
};

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
  LANG_AMHARIC,
  LANG_INDONESIAN,
  LANG_ARMENIAN,
];

export const POPULAR_LANGUAGES = [
  LANG_HEBREW,
  LANG_ENGLISH,
  LANG_RUSSIAN,
  LANG_SPANISH
];

export const AUDIO_BLOG_LANGUAGES = [
  LANG_RUSSIAN,
  LANG_ENGLISH
];

export const DEFAULT_LANGUAGE = LANG_ENGLISH;

export const LANGUAGE_OPTIONS = ALL_LANGUAGES.map(x => LANGUAGES[x]);

export const MT_VIDEO        = 'video';
export const MT_AUDIO        = 'audio';
export const MT_IMAGE        = 'image';
export const MT_TEXT         = 'text';
export const MT_SHEET        = 'sheet';
export const MT_BANNER       = 'banner';
export const MT_PRESENTATION = 'presentation';

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

export const EVENT_TYPES    = [CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY];
export const SORTABLE_TYPES = [CT_SONGS, CT_LESSONS_SERIES, CT_HOLIDAY];

// Required for Sections filter.
export const COLLECTION_LESSONS_TYPE      = [CT_DAILY_LESSON, CT_SPECIAL_LESSON, /* CT_CHILDREN_LESSONS, */ CT_WOMEN_LESSONS, CT_VIRTUAL_LESSONS, CT_LECTURE_SERIES, CT_LESSONS_SERIES];
export const COLLECTION_PROGRAMS_TYPE     = [CT_VIDEO_PROGRAM, CT_CLIPS];
export const COLLECTION_EVENTS_TYPE       = [CT_FRIENDS_GATHERINGS, CT_MEALS, ...EVENT_TYPES];
export const COLLECTION_PUBLICATIONS_TYPE = [CT_ARTICLES];
export const UNIT_LESSONS_TYPE            = [CT_LESSON_PART, /* CT_CHILDREN_LESSON, */ CT_WOMEN_LESSON, CT_VIRTUAL_LESSON, CT_FULL_LESSON, CT_LECTURE];
export const UNIT_PROGRAMS_TYPE           = [CT_VIDEO_PROGRAM_CHAPTER, CT_CLIP];
export const UNIT_EVENTS_TYPE             = [CT_EVENT_PART, CT_MEAL, CT_FRIENDS_GATHERING];
export const UNIT_PUBLICATIONS_TYPE       = [CT_ARTICLE, CT_PUBLICATION, CT_BLOG_POST, SCT_BLOG_POST, SCT_TWEET];
export const DERIVED_UNITS_CONTENT_TYPE   = [CT_VIDEO_PROGRAM_CHAPTER, CT_CLIP];

export const COLLECTION_DAILY_LESSONS = [CT_DAILY_LESSON, CT_SPECIAL_LESSON];

export const NO_NAME = '☠ no name';

// Sources
export const BS_SHAMATI  = 'qMUUn22b';
export const BS_IGROT    = 'DVSS0xAR';
export const BS_TAAS     = 'xtKmrbb9';
export const BS_ETZ_HAIM = 'SqBA6XOl';
export const RB_IGROT    = 'b8SHlrfH';
export const MR_TORA     = 'bvA8ZB1w';
export const RH_ZOHAR    = 'AwGBQX2L';
export const RH_ARTICLES = 'rQ6sIUZK';
export const RH_RECORDS  = '2GAdavz0';

// This is exptected to be sorted by values
export const BS_TAAS_PARTS = {
  '7scSATcZ': 1,
  'LIMg3y94': 9,
  'rhRuFdIP': 13,
  'YR9r5s6q': 29,
  'QCnCAagn': 30,
  'EiUPsO0e': 31,
  'nnGQFc43': 34,
  'EgYCDrzH': 37,
  'hwh1BLAL': 48,
  'PtDrdt9v': 55,
  'ydlHgmBg': 83,
  'VBX3VORk': 84,
  'YhAlwjNh': 86,
  'F1dDm1OY': 93,
  '37cdWCQP': 101,
  'oL32UjM6': 106,
  'p2bm9quF': 109,
  '8ajjCTtg': 113,
  'ulorFJ0c': 119,
  'olYs3pHe': 123,
  'kiTxkfet': 126,
  'nZicYkes': 133,
  '1bAtXKoc': 138,
  'gqhAImdo': 145,
  'AnVscbAJ': 149,
  'EnFXBYxy': 154,
  'B8ZHQh1D': 158,
  'i3Wim559': 161,
  'nOLBngLq': 164,
  '1yRKGJfc': 167,
  'zCY8AVzl': 185,
  'S5mViX7z': 187,
  '4KFDFg3m': 190,
  'Levgq2jH': 197,
  'h97a60Mc': 209,
  'MGl4GjjS': 218,
  'EU5TTtcy': 224,
  'ldrFtcev': 232,
  'RTzg7sXm': 239,
  'jnRyYLeP': 245,
  'BjZJBha8': 257,
  'PNEWuQYa': 275,
  'Ut8PE5aO': 276,
  'sL3XV5Dr': 283,
  '1t0TL11u': 285,
  '4pmOtkWY': 291,
  'fSmz8o3A': 359,
  'uyAWnLqJ': 360,
  '2zI4yXlE': 364,
  'H9JMve9K': 368,
  '9Poika27': 386,
  'DztxuIK7': 389,
  'aA8oiLQA': 440,
  'Py2DZ1ES': 452,
  'kqEIM6f0': 462,
  'jOttKP5x': 463,
  'AkCMSd9U': 468,
  'tDNxLdgR': 470,
  'KGNYqv7h': 478,
  'HXvOiFNY': 479,
  'FWrR48Bb': 485,
  '77Yq5OF7': 546,
  'rutwuYR8': 561,
  'dgNJLnA7': 570,
  'P5q0Zmm6': 572,
  'hdywOExs': 581,
  'wOz46Ac9': 583,
  'teM5Yc6B': 590,
  'NlYgsUxe': 599,
  'twSOJdmU': 688,
  'OF3SI33X': 699,
  'JQn92bOZ': 702,
  'yBEWcZWe': 703,
  'yG5OG3aS': 708,
  'BeNvMLuu': 711,
  'qk1TqqNn': 724,
  'z6MVO6UG': 731,
  'n74IfjUw': 813,
  'oFfVR1sj': 821,
  'X714OgYa': 823,
  '56K73eNi': 844,
  'DhYu7bEh': 847,
  '1zYk2z7m': 865,
  'L5xO0yDG': 956,
  '9gSOlEJl': 970,
  'LRQKRR2e': 972,
  'ac3R2k8O': 987,
  'Vw89jmcY': 990,
  '1kY2wOt9': 1011,
  'eUDvJPEz': 1083,
  '38p1N7aA': 1085,
  'h5CQQmY5': 1099,
  'awbSqHpG': 1103,
  'OyVZGDKM': 1127,
  'nO9GGoAX': 1244,
  'XCjEhLDK': 1249,
  'ga3l0sjf': 1252,
  '0quwYeDZ': 1278,
  '1uquRur7': 1282,
  'TndRK0X8': 1297,
  's7NzunI1': 1436,
  'w7qMVrQ0': 1448,
  'jdYR1m8g': 1451,
  'DDYm2kER': 1478,
  'JRgKUhzy': 1480,
  'LrYhEexG': 1493,
  '9Bh6AztV': 1621,
  '2mI59NJA': 1625,
  'oB3J4iLO': 1658,
  'T2hJcy9X': 1662,
  'It7YBuab': 1687,
  'feo7h6Fe': 1820,
  'PtJHZD93': 1823,
  'ur26eJ0c': 1850,
  'vpnmTC4W': 1857,
  'SU8TzXty': 1887,
  'li1hvo4P': 2034,
  'tcBbUnBZ': 2040,
  'TaGXjokb': 2075,
  'P727ETJu': 2080
};

export const BS_TAAS_PARTS_PARTS_ONLY = {
  '9xNFLSSp': 1,
  'XlukqLH8': 37,
  'AerA1hNN': 101,
  '1kDKQxJb': 209,
  'o5lXptLo': 291,
  'eNwJXy4s': 389,
  'ahipVtPu': 485,
  'Pscnn3pP': 599,
  'Lfu7W3CD': 731,
  'n03vXCJl': 865,
  'UGcGGSpP': 1011,
  'NpLQT0LX': 1127,
  'AUArdCkH': 1297,
  'tit6XNAo': 1493,
  'FaKUG7ru': 1687,
  'mW6eON0z': 1887,
};

// Persons
export const RABASH_PERSON_UID = 'KxApZ4pI';

export const COOKIE_UI_LANG      = 'archive_UIlang';
export const COOKIE_CONTENT_LANG = 'archive_ContentLang';
export const LANG_UI_LANGUAGES   = [LANG_HEBREW, LANG_ENGLISH, LANG_RUSSIAN, LANG_SPANISH, LANG_GERMAN, LANG_UKRAINIAN, LANG_ITALIAN, LANG_TURKISH, LANG_CZECH];

// Search

export const SEARCH_GRAMMAR_HIT_TYPE_LANDING_PAGE = 'landing-page';

// Search Grammar Landing Pages (SGL) constants.
const SGLP_LESSONS              = 'lessons';
const SGLP_VIRTUAL_LESSONS      = 'virtual_lessons';
const SGLP_LECTURES             = 'lectures';
const SGLP_WOMEN_LESSONS        = 'women_lessons';
const SGLP_RABASH_LESSONS       = 'rabash_lessons';
export const SGLP_LESSON_SERIES = 'lesson_series';
export const SGLP_PRORGRAMS     = 'programs';
const SGLP_CLIPS                = 'clips';
const SGLP_LIBRARY              = 'library';
const SGLP_GROUP_ARTICLES       = 'group_articles';
const SGLP_CONVENTIONS          = 'conventions';
const SGLP_HOLIDAYS             = 'holidays';
const SGLP_UNITY_DAYS           = 'unity_days';
const SGLP_FRIENDS_GATHERINGS   = 'friends_gatherings';
const SGLP_MEALS                = 'meals';
const SGLP_TOPICS               = 'topics';
const SGLP_BLOG                 = 'blog';
const SGLP_TWITTER              = 'twitter';
const SGLP_ARTICLES             = 'articles';
const SGLP_DOWNLOADS            = 'downloads';
const SGLP_HELP                 = 'help';

export const SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_LINK = {
  [SGLP_LESSONS]: 'lessons/daily',
  [SGLP_VIRTUAL_LESSONS]: 'lessons/virtual',
  [SGLP_LECTURES]: 'lessons/lectures',
  [SGLP_WOMEN_LESSONS]: 'lessons/women',
  [SGLP_RABASH_LESSONS]: 'lessons/rabash',
  [SGLP_LESSON_SERIES]: 'lessons/series',
  [SGLP_PRORGRAMS]: 'programs/main',
  [SGLP_CLIPS]: 'programs/clips',
  [SGLP_LIBRARY]: 'sources',
  [SGLP_GROUP_ARTICLES]: 'sources/grRABASH',
  [SGLP_CONVENTIONS]: 'events/conventions',
  [SGLP_HOLIDAYS]: 'events/holidays',
  [SGLP_UNITY_DAYS]: 'events/unity-days',
  [SGLP_FRIENDS_GATHERINGS]: 'events/friends-gatherings',
  [SGLP_MEALS]: 'events/meals',
  [SGLP_TOPICS]: 'topics',
  [SGLP_BLOG]: 'publications/blog',
  [SGLP_TWITTER]: 'publications/twitter',
  [SGLP_ARTICLES]: 'publications/articles',
  [SGLP_DOWNLOADS]: 'simple-mode',
  [SGLP_HELP]: 'help',
};

export const SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_TEXT = {
  [SGLP_LESSONS]: 'lessons.tabs.daily',
  [SGLP_VIRTUAL_LESSONS]: 'lessons.tabs.virtual',
  [SGLP_LECTURES]: 'lessons.tabs.lectures',
  [SGLP_WOMEN_LESSONS]: 'lessons.tabs.women',
  [SGLP_RABASH_LESSONS]: 'lessons.tabs.rabash',
  [SGLP_LESSON_SERIES]: 'lessons.tabs.series',
  [SGLP_PRORGRAMS]: 'programs.tabs.main',
  [SGLP_CLIPS]: 'programs.tabs.clips',
  [SGLP_LIBRARY]: 'sources-library.header.text',
  [SGLP_GROUP_ARTICLES]: 'sources-library.group-articles',
  [SGLP_CONVENTIONS]: 'events.tabs.conventions',
  [SGLP_HOLIDAYS]: 'events.tabs.holidays',
  [SGLP_UNITY_DAYS]: 'events.tabs.unity-days',
  [SGLP_FRIENDS_GATHERINGS]: 'events.tabs.friends-gatherings',
  [SGLP_MEALS]: 'events.tabs.meals',
  [SGLP_TOPICS]: 'topics.header.text',
  [SGLP_BLOG]: 'publications.tabs.blog',
  [SGLP_TWITTER]: 'publications.tabs.twitter',
  [SGLP_ARTICLES]: 'publications.tabs.articles',
  [SGLP_DOWNLOADS]: 'simple-mode.header.text',
  [SGLP_HELP]: 'help.header.text',
};

export const SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_SUBTEXT = {
  [SGLP_LESSONS]: 'lessons.header.subtext',
  [SGLP_VIRTUAL_LESSONS]: 'lessons.header.subtext',
  [SGLP_LECTURES]: 'lessons.header.subtext',
  [SGLP_WOMEN_LESSONS]: 'lessons.header.subtext',
  [SGLP_RABASH_LESSONS]: 'lessons.header.subtext',
  [SGLP_LESSON_SERIES]: 'lessons.header.subtext',
  [SGLP_PRORGRAMS]: 'programs.header.subtext',
  [SGLP_CLIPS]: '',  // Subtext is appropriate only for programs.
  [SGLP_LIBRARY]: 'sources-library.header.subtext',
  [SGLP_GROUP_ARTICLES]: 'sources-library.header.subtext',
  [SGLP_CONVENTIONS]: 'events.header.subtext',
  [SGLP_HOLIDAYS]: 'events.header.subtext',
  [SGLP_UNITY_DAYS]: 'events.header.subtext',
  [SGLP_FRIENDS_GATHERINGS]: 'events.header.subtext',
  [SGLP_MEALS]: 'events.header.subtext',
  [SGLP_TOPICS]: 'topics.header.subtext',
  [SGLP_BLOG]: 'publications.header.subtext',
  [SGLP_TWITTER]: 'publications.header.subtext',
  [SGLP_ARTICLES]: 'publications.header.subtext',
  [SGLP_DOWNLOADS]: 'simple-mode.header.subtext',
  [SGLP_HELP]: 'help.header.subtext',
};

export const SEARCH_GRAMMAR_HIT_TYPES = [SEARCH_GRAMMAR_HIT_TYPE_LANDING_PAGE];

// Blog
export const BLOG_ID_LAITMAN_RU    = 1;
export const BLOG_ID_LAITMAN_COM   = 2;
export const BLOG_ID_LAITMAN_ES    = 3;
export const BLOG_ID_LAITMAN_CO_IL = 4;
export const BLOGS                 = [
  { id: BLOG_ID_LAITMAN_RU, name: 'laitman-ru' },
  { id: BLOG_ID_LAITMAN_COM, name: 'laitman-com' },
  { id: BLOG_ID_LAITMAN_ES, name: 'laitman-es' },
  { id: BLOG_ID_LAITMAN_CO_IL, name: 'laitman-co-il' }
];

export const SUGGEST_LIMIT = 10;

// Search Intent constants (to be deprecated).

// Elastic Search (ES).
export const ES_RESULT_TYPE_SOURCES = 'sources';
export const ES_RESULT_TYPE_TAGS    = 'tags';

export const SEARCH_INTENT_INDEX_TOPIC               = 'intent-tag';
export const SEARCH_INTENT_INDEX_SOURCE              = 'intent-source';
export const SEARCH_INTENT_HIT_TYPE_PROGRAMS         = 'programs';
export const SEARCH_INTENT_HIT_TYPE_LESSONS          = 'lessons';
export const SEARCH_INTENT_HIT_TYPE_SERIES_BY_TAG    = 'lessons_series_by_tag';
export const SEARCH_INTENT_HIT_TYPE_SERIES_BY_SOURCE = 'lessons_series_by_source';

export const SEARCH_RESULT_TYPES_TEXT = ['posts', 'sources', 'units'];

export const SEARCH_INTENT_HIT_TYPES = [SEARCH_INTENT_HIT_TYPE_PROGRAMS, SEARCH_INTENT_HIT_TYPE_LESSONS];

export const SEARCH_INTENT_NAMES = {
  [SEARCH_INTENT_INDEX_TOPIC]: 'Topic',
  [SEARCH_INTENT_INDEX_SOURCE]: 'Source',
};

export const SEARCH_INTENT_FILTER_NAMES = {
  [SEARCH_INTENT_INDEX_TOPIC]: 'topics-filter',
  [SEARCH_INTENT_INDEX_SOURCE]: 'sources-filter',
};

export const SEARCH_INTENT_SECTIONS = {
  [SEARCH_INTENT_HIT_TYPE_LESSONS]: 'lessons',
  [SEARCH_INTENT_HIT_TYPE_PROGRAMS]: 'programs',
};

export const SCROLL_SEARCH_ID = '__scrollSearchToHere__';

export const MY_NAMESPACE_HISTORY       = 'history';
export const MY_NAMESPACE_REACTIONS     = 'reactions';
export const MY_NAMESPACE_PLAYLISTS     = 'playlists';
export const MY_NAMESPACE_PLAYLIST_EDIT = 'playlists_edit';
export const MY_NAMESPACE_SUBSCRIPTIONS = 'subscriptions';
export const MY_NAMESPACE_BOOKMARKS     = 'bookmarks';
export const MY_NAMESPACE_FOLDERS       = 'folders';
export const MY_NAMESPACE_LABELS        = 'labels';

export const MY_NAMESPACES = [
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_REACTIONS,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS,
  MY_NAMESPACE_PLAYLIST_EDIT,
  MY_NAMESPACE_BOOKMARKS,
  MY_NAMESPACE_FOLDERS,
  MY_NAMESPACE_LABELS,
];

export const MY_REACTION_KINDS = {
  LIKE: 'like',
  SUPER: 'super',
};

export const MY_BOOKMARK_FILTER_FOLDER_ID = 'folder_id';
export const MY_BOOKMARK_FILTER_QUERY     = 'bookmark_query';

export const CT_SUBSCRIBE_BY_TYPE = [
  CT_FRIENDS_GATHERINGS,
  CT_WOMEN_LESSONS,
  CT_MEALS,
  CT_LECTURE,
  CT_MEAL,
  CT_LESSON_PART,
];

export const CT_SUBSCRIBE_BY_COLLECTION = [
  CT_LECTURE,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_ARTICLE,
  CT_EVENT_PART,
  CT_CLIP,
  CT_TRAINING,
  CT_KITEI_MAKOR,
  CT_PUBLICATION, //check language
  CT_LELO_MIKUD,
  CT_BLOG_POST,
  CT_RESEARCH_MATERIAL,
  CT_KTAIM_NIVCHARIM,
  CT_LIKUTIM,
];

export const SECTIONS_LINK_BY_CU_CONTENT_TYPE = {
  [CT_LESSON_PART]: 'lessons/daily',
  [CT_VIRTUAL_LESSON]: 'lessons/virtual',
  [CT_LECTURE]: 'lessons/lectures',
  [CT_WOMEN_LESSON]: 'lessons/women',
  [CT_VIDEO_PROGRAM_CHAPTER]: 'programs/main',
  [CT_CLIP]: 'programs/clips',
  [CT_FRIENDS_GATHERING]: 'events/friends-gatherings',
  [CT_MEAL]: 'events/meals',
  [CT_BLOG_POST]: 'publications/blog',
  [SCT_TWEET]: 'publications/twitter',
  [CT_ARTICLE]: 'publications/articles',
};

export const UNIT_TEXT_TYPE   = [CT_ARTICLE, CT_BLOG_POST, CT_PUBLICATION, CT_RESEARCH_MATERIAL, CT_SOURCE, CT_LIKUTIM];
export const UNIT_VIDEOS_TYPE = [...UNIT_LESSONS_TYPE, ...UNIT_PROGRAMS_TYPE, ...UNIT_EVENTS_TYPE];

export const FN_SOURCES            = 'sources-filter';
export const FN_TOPICS             = 'topics-filter';
export const FN_LANGUAGES          = 'language-filter';
export const FN_ORIGINAL_LANGUAGES = 'original-language-filter';
export const FN_CONTENT_TYPE       = 'content-type-filter';
export const FN_DATE_FILTER        = 'date-filter';
export const FN_PERSON             = 'person-filter';
export const FN_MEDIA_TYPE         = 'media-type-filter';
export const FN_LOCATIONS          = 'locations-filter';
export const FN_FREE_TEXT          = 'free-text';

export const FN_SOURCES_MULTI    = 'sources-filter-multi';
export const FN_TOPICS_MULTI     = 'topics-filter-multi';
export const FN_COLLECTION_MULTI = 'collections-filter-multi';

export const PAGE_NS_TOPICS   = 'topic';
export const PAGE_NS_PROGRAMS = 'programs';
export const PAGE_NS_LESSONS  = 'lessons';
export const PAGE_NS_EVENTS   = 'events';
export const PAGE_NS_LIKUTIM  = 'likutim';

export const ALL_PAGE_NS = [PAGE_NS_LESSONS, PAGE_NS_TOPICS, PAGE_NS_PROGRAMS, PAGE_NS_EVENTS, PAGE_NS_LIKUTIM];

export const EVENT_PAGE_CTS = [...EVENT_TYPES, CT_MEAL, CT_FRIENDS_GATHERING, CT_HOLIDAY];

export const CT_LESSONS = [CT_LESSON_PART, CT_DAILY_LESSON];

export const FN_SHOW_LESSON_AS_UNITS = [FN_SOURCES_MULTI, FN_TOPICS_MULTI, FN_PERSON, FN_LANGUAGES, FN_ORIGINAL_LANGUAGES, FN_MEDIA_TYPE];

export const JWPLAYER_ID = 'jwplayer';

export const PLAYER_OVER_MODES = {
  settings: 'settings',
  share: 'share',
};
