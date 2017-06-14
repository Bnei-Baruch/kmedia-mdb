// Collection Types
export const CT_DAILY_LESSON       = 'DAILY_LESSON';
export const CT_SPECIAL_LESSON     = 'SPECIAL_LESSON';
export const CT_FRIENDS_GATHERINGS = 'FRIENDS_GATHERINGS';
export const CT_CONGRESS           = 'CONGRESS';
export const CT_VIDEO_PROGRAM      = 'VIDEO_PROGRAM';
export const CT_LECTURE_SERIES     = 'LECTURE_SERIES';
export const CT_MEALS              = 'MEALS';
export const CT_HOLIDAY            = 'HOLIDAY';
export const CT_PICNIC             = 'PICNIC';
export const CT_UNITY_DAY          = 'UNITY_DAY';

// Content Unit Types
export const CT_LESSON_PART           = 'LESSON_PART';
export const CT_LECTURE               = 'LECTURE';
export const CT_CHILDREN_LESSON_PART  = 'CHILDREN_LESSON_PART';
export const CT_WOMEN_LESSON_PART     = 'WOMEN_LESSON_PART';
export const CT_VIRTUAL_LESSON        = 'VIRTUAL_LESSON';
export const CT_FRIENDS_GATHERING     = 'FRIENDS_GATHERING';
export const CT_MEAL                  = 'MEAL';
export const CT_VIDEO_PROGRAM_CHAPTER = 'VIDEO_PROGRAM_CHAPTER';
export const CT_FULL_LESSON           = 'FULL_LESSON';
export const CT_TEXT                  = 'TEXT';
export const CT_UNKNOWN               = 'UNKNOWN';
export const CT_EVENT_PART            = 'EVENT_PART';
export const CT_CLIP                  = 'CLIP';
export const CT_TRAINING              = 'TRAINING';
export const CT_KITEI_MAKOR           = 'KITEI_MAKOR';

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
  [LANG_HEBREW]: { text: 'עברית', value: LANG_HEBREW, flag: 'il' },
  [LANG_ENGLISH]: { text: 'English', value: LANG_ENGLISH, flag: 'us' },
  [LANG_RUSSIAN]: { text: 'Русский', value: LANG_RUSSIAN, flag: 'ru' },
  [LANG_SPANISH]: { text: 'Español', value: LANG_SPANISH, flag: 'es' },
  [LANG_ITALIAN]: { text: 'Italiano', value: LANG_ITALIAN, flag: 'it' },
  [LANG_GERMAN]: { text: 'Deutsch', value: LANG_GERMAN, flag: 'de' },
  [LANG_DUTCH]: { text: 'Dutch', value: LANG_DUTCH, flag: 'nl' },
  [LANG_FRENCH]: { text: 'Français', value: LANG_FRENCH, flag: 'fr' },
  [LANG_PORTUGUESE]: { text: 'Português', value: LANG_PORTUGUESE, flag: 'pt' },
  [LANG_TURKISH]: { text: 'Türkçe', value: LANG_TURKISH, flag: 'tr' },
  [LANG_POLISH]: { text: 'Polszczyzna', value: LANG_POLISH, flag: 'pl' },
  [LANG_ARABIC]: { text: 'العربية', value: LANG_ARABIC, flag: 'sa' },
  [LANG_HUNGARIAN]: { text: 'magyar', value: LANG_HUNGARIAN, flag: 'hu' },
  [LANG_FINNISH]: { text: 'suomi', value: LANG_FINNISH, flag: 'fi' },
  [LANG_LITHUANIAN]: { text: 'Lietuvių kalba', value: LANG_LITHUANIAN, flag: 'lt' },
  [LANG_JAPANESE]: { text: '日本語', value: LANG_JAPANESE, flag: 'jp' },
  [LANG_BULGARIAN]: { text: 'Български език', value: LANG_BULGARIAN, flag: 'bg' },
  [LANG_GEORGIAN]: { text: 'ქართული', value: LANG_GEORGIAN, flag: 'ge' },
  [LANG_NORWEGIAN]: { text: 'Norsk', value: LANG_NORWEGIAN, flag: 'no' },
  [LANG_SWEDISH]: { text: 'Svenska', value: LANG_SWEDISH, flag: 'se' },
  [LANG_CROATIAN]: { text: 'hrvatski jezik', value: LANG_CROATIAN, flag: 'hr' },
  [LANG_CHINESE]: { text: '中文', value: LANG_CHINESE, flag: 'cn' },
  [LANG_PERSIAN]: { text: 'فارسى', value: LANG_PERSIAN, flag: 'ir' },
  [LANG_ROMANIAN]: { text: 'Română', value: LANG_ROMANIAN, flag: 'ro' },
  [LANG_HINDI]: { text: 'हिन्दी, हिंदी', value: LANG_HINDI, flag: 'in' },
  [LANG_UKRAINIAN]: { text: 'Українська', value: LANG_UKRAINIAN, flag: 'ua' },
  [LANG_MACEDONIAN]: { text: 'македонски јазик', value: LANG_MACEDONIAN, flag: 'mk' },
  [LANG_SLOVENIAN]: { text: 'Slovenščina', value: LANG_SLOVENIAN, flag: 'si' },
  [LANG_LATVIAN]: { text: 'Latviešu valoda', value: LANG_LATVIAN, flag: 'lv' },
  [LANG_SLOVAK]: { text: 'slovenčina', value: LANG_SLOVAK, flag: 'sk' },
  [LANG_CZECH]: { text: 'čeština', value: LANG_CZECH, flag: 'cz' },
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
];

export const RTL_LANGUAGES = [
  LANG_HEBREW,
  LANG_ARABIC,
  LANG_PERSIAN,
];

export const LANGUAGE_OPTIONS = ALL_LANGUAGES.map(x => LANGUAGES[x]);

export const MT_VIDEO = 'video';
export const MT_AUDIO = 'audio';
export const MT_IMAGE = 'image';
export const MT_TEXT = 'text';
export const MT_SHEET = 'sheet';
export const MT_BANNER = 'banner';
export const MT_PRESENTATION = 'presentation';

export const TAG_ROOT_TOPICS = 'mS7hrYXK';
