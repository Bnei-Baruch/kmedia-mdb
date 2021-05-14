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

export const IsCollectionContentType = (contentType) => CT_COLLECTIONS.includes(contentType);

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
export const LANG_UNKNOWN    = 'xx';

export const LANGUAGES = {
  [LANG_HEBREW]: { value: LANG_HEBREW, flag: 'il', locale: 'he_IL', lang3: 'HEB' },
  [LANG_ENGLISH]: { value: LANG_ENGLISH, flag: 'us', locale: 'en_US', lang3: 'ENG' },
  [LANG_RUSSIAN]: { value: LANG_RUSSIAN, flag: 'ru', locale: 'ru_RU', lang3: 'RUS' },
  [LANG_SPANISH]: { value: LANG_SPANISH, flag: 'es', locale: 'es_ES', lang3: 'SPA' },
  [LANG_ITALIAN]: { value: LANG_ITALIAN, flag: 'it', locale: 'it_IT', lang3: 'ITA' },
  [LANG_GERMAN]: { value: LANG_GERMAN, flag: 'de', locale: 'de_DE', lang3: 'GER' },
  [LANG_DUTCH]: { value: LANG_DUTCH, flag: 'nl', locale: 'nl_NL', lang3: 'DUT' },
  [LANG_FRENCH]: { value: LANG_FRENCH, flag: 'fr', locale: 'fr_FR', lang3: 'FRE' },
  [LANG_PORTUGUESE]: { value: LANG_PORTUGUESE, flag: 'pt', locale: 'pt_PT', lang3: 'POR' },
  [LANG_TURKISH]: { value: LANG_TURKISH, flag: 'tr', locale: 'tr_TR', lang3: 'TRK' },
  [LANG_POLISH]: { value: LANG_POLISH, flag: 'pl', locale: 'pl_PL', lang3: 'POL' },
  [LANG_ARABIC]: { value: LANG_ARABIC, flag: 'sa', locale: 'ar_AR', lang3: 'ARB' },
  [LANG_HUNGARIAN]: { value: LANG_HUNGARIAN, flag: 'hu', locale: 'hu_HU', lang3: 'HUN' },
  [LANG_FINNISH]: { value: LANG_FINNISH, flag: 'fi', locale: 'fi_FI', lang3: 'FIN' },
  [LANG_LITHUANIAN]: { value: LANG_LITHUANIAN, flag: 'lt', locale: 'lt_LT', lang3: 'LIT' },
  [LANG_JAPANESE]: { value: LANG_JAPANESE, flag: 'jp', locale: 'ja_JP', lang3: 'JPN' },
  [LANG_BULGARIAN]: { value: LANG_BULGARIAN, flag: 'bg', locale: 'bg_BG', lang3: 'BUL' },
  [LANG_GEORGIAN]: { value: LANG_GEORGIAN, flag: 'ge', locale: 'ka_GE', lang3: 'GEO' },
  // TODO: choose from Norwegian Bokmål / Norwegian Nynorsk
  [LANG_NORWEGIAN]: { value: LANG_NORWEGIAN, flag: 'no', locale: 'nb_NO', lang3: 'NOT' },
  [LANG_SWEDISH]: { value: LANG_SWEDISH, flag: 'se', locale: 'sv_SE', lang3: 'SWE' },
  [LANG_CROATIAN]: { value: LANG_CROATIAN, flag: 'hr', locale: 'hr_HR', lang3: 'HRV' },
  [LANG_CHINESE]: { value: LANG_CHINESE, flag: 'cn', locale: 'zh_CN', lang3: 'CHN' },
  [LANG_PERSIAN]: { value: LANG_PERSIAN, flag: 'ir', locale: 'fa_IR', lang3: 'PER' },
  [LANG_ROMANIAN]: { value: LANG_ROMANIAN, flag: 'ro', locale: 'ro_RO', lang3: 'RON' },
  [LANG_HINDI]: { value: LANG_HINDI, flag: 'in', locale: 'hi_IN', lang3: 'HIN' },
  [LANG_UKRAINIAN]: { value: LANG_UKRAINIAN, flag: 'ua', locale: 'uk_UA', lang3: 'UKR' },
  [LANG_MACEDONIAN]: { value: LANG_MACEDONIAN, flag: 'mk', locale: 'mk_MK', lang3: 'MKD' },
  [LANG_SLOVENIAN]: { value: LANG_SLOVENIAN, flag: 'si', locale: 'sl_SI', lang3: 'SLV' },
  [LANG_LATVIAN]: { value: LANG_LATVIAN, flag: 'lv', locale: 'lv_LV', lang3: 'LAV' },
  [LANG_SLOVAK]: { value: LANG_SLOVAK, flag: 'sk', locale: 'sk_SK', lang3: 'SLK' },
  [LANG_CZECH]: { value: LANG_CZECH, flag: 'cz', locale: 'cs_CZ', lang3: 'CZE' },
  [LANG_AMHARIC]: { value: LANG_AMHARIC, flag: 'et', locale: 'am_ET', lang3: 'AMH' },
};

export const FLAG_TO_LANGUAGE = Object.values(LANGUAGES).reduce((acc, language) => {
  acc[language.flag] = language.value;
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
  LANG_AMHARIC,
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

export const EVENT_TYPES = [
  CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY
];

// Required for Sections filter.
export const COLLECTION_LESSONS_TYPE  = [CT_DAILY_LESSON, CT_SPECIAL_LESSON, /* CT_CHILDREN_LESSONS, */ CT_WOMEN_LESSONS, CT_VIRTUAL_LESSONS, CT_LECTURE_SERIES];
export const NO_COLLECTION_VIEW_TYPE  = [CT_DAILY_LESSON, CT_SPECIAL_LESSON];
export const COLLECTION_PROGRAMS_TYPE = [CT_VIDEO_PROGRAM, CT_CLIPS];
export const COLLECTION_EVENTS_TYPE             = [CT_FRIENDS_GATHERINGS, CT_MEALS, ...EVENT_TYPES];
export const COLLECTION_PUBLICATIONS_TYPE       = [CT_ARTICLES];
export const UNIT_LESSONS_TYPE                  = [CT_LESSON_PART, /* CT_CHILDREN_LESSON, */ CT_WOMEN_LESSON, CT_VIRTUAL_LESSON, CT_FULL_LESSON, CT_LECTURE];
export const UNIT_PROGRAMS_TYPE                 = [CT_VIDEO_PROGRAM_CHAPTER, CT_CLIP];
export const UNIT_EVENTS_TYPE                   = [CT_EVENT_PART, CT_MEAL, CT_FRIENDS_GATHERING];
export const UNIT_PUBLICATIONS_TYPE             = [CT_ARTICLE, CT_PUBLICATION, CT_BLOG_POST, SCT_BLOG_POST, SCT_TWEET];
export const DERIVED_UNITS_CONTENT_TYPE         = [CT_VIDEO_PROGRAM_CHAPTER, CT_CLIP];

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

// Persons
export const RABASH_PERSON_UID = 'KxApZ4pI';

export const COOKIE_UI_LANG      = 'archive_UIlang';
export const COOKIE_CONTENT_LANG = 'archive_ContentLang';
export const LANG_UI_LANGUAGES   = [LANG_HEBREW, LANG_ENGLISH, LANG_RUSSIAN, LANG_SPANISH, LANG_GERMAN, LANG_UKRAINIAN, LANG_ITALIAN, LANG_TURKISH, LANG_CZECH];

// Search

export const SEARCH_GRAMMAR_HIT_TYPE_LANDING_PAGE = 'landing-page';

// Search Grammar Landing Pages (SGL) constants.
const SGLP_LESSONS            = 'lessons';
const SGLP_VIRTUAL_LESSONS    = 'virtual_lessons';
const SGLP_LECTURES           = 'lectures';
const SGLP_WOMEN_LESSONS      = 'women_lessons';
const SGLP_RABASH_LESSONS     = 'rabash_lessons';
const SGLP_LESSON_SERIES      = 'lesson_series';
const SGLP_PRORGRAMS          = 'programs';
const SGLP_CLIPS              = 'clips';
const SGLP_LIBRARY            = 'library';
const SGLP_GROUP_ARTICLES     = 'group_articles';
const SGLP_CONVENTIONS        = 'conventions';
const SGLP_HOLIDAYS           = 'holidays';
const SGLP_UNITY_DAYS         = 'unity_days';
const SGLP_FRIENDS_GATHERINGS = 'friends_gatherings';
const SGLP_MEALS              = 'meals';
const SGLP_TOPICS             = 'topics';
const SGLP_BLOG               = 'blog';
const SGLP_TWITTER            = 'twitter';
const SGLP_ARTICLES           = 'articles';
const SGLP_DOWNLOADS          = 'downloads';
const SGLP_HELP               = 'help';

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

export const SEARCH_INTENT_INDEX_TOPIC       = 'intent-tag';
export const SEARCH_INTENT_INDEX_SOURCE      = 'intent-source';
export const SEARCH_INTENT_HIT_TYPE_PROGRAMS = 'programs';
export const SEARCH_INTENT_HIT_TYPE_LESSONS  = 'lessons';

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
