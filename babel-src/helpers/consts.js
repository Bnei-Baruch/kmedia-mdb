'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LANGUAGES;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Collection Types
var CT_DAILY_LESSON = exports.CT_DAILY_LESSON = 'DAILY_LESSON';
var CT_SPECIAL_LESSON = exports.CT_SPECIAL_LESSON = 'SPECIAL_LESSON';
var CT_FRIENDS_GATHERINGS = exports.CT_FRIENDS_GATHERINGS = 'FRIENDS_GATHERINGS';
var CT_VIDEO_PROGRAM = exports.CT_VIDEO_PROGRAM = 'VIDEO_PROGRAM';
var CT_LECTURE_SERIES = exports.CT_LECTURE_SERIES = 'LECTURE_SERIES';
var CT_CHILDREN_LESSONS = exports.CT_CHILDREN_LESSONS = 'CHILDREN_LESSONS';
var CT_WOMEN_LESSONS = exports.CT_WOMEN_LESSONS = 'WOMEN_LESSONS';
var CT_VIRTUAL_LESSONS = exports.CT_VIRTUAL_LESSONS = 'VIRTUAL_LESSONS';
var CT_MEALS = exports.CT_MEALS = 'MEALS';
var CT_CONGRESS = exports.CT_CONGRESS = 'CONGRESS';
var CT_HOLIDAY = exports.CT_HOLIDAY = 'HOLIDAY';
var CT_PICNIC = exports.CT_PICNIC = 'PICNIC';
var CT_UNITY_DAY = exports.CT_UNITY_DAY = 'UNITY_DAY';

// Content Unit Types
var CT_LESSON_PART = exports.CT_LESSON_PART = 'LESSON_PART';
var CT_LECTURE = exports.CT_LECTURE = 'LECTURE';
var CT_CHILDREN_LESSON = exports.CT_CHILDREN_LESSON = 'CHILDREN_LESSON';
var CT_WOMEN_LESSON = exports.CT_WOMEN_LESSON = 'WOMEN_LESSON';
var CT_VIRTUAL_LESSON = exports.CT_VIRTUAL_LESSON = 'VIRTUAL_LESSON';
var CT_FRIENDS_GATHERING = exports.CT_FRIENDS_GATHERING = 'FRIENDS_GATHERING';
var CT_MEAL = exports.CT_MEAL = 'MEAL';
var CT_VIDEO_PROGRAM_CHAPTER = exports.CT_VIDEO_PROGRAM_CHAPTER = 'VIDEO_PROGRAM_CHAPTER';
var CT_FULL_LESSON = exports.CT_FULL_LESSON = 'FULL_LESSON';
var CT_TEXT = exports.CT_TEXT = 'TEXT';
var CT_UNKNOWN = exports.CT_UNKNOWN = 'UNKNOWN';
var CT_EVENT_PART = exports.CT_EVENT_PART = 'EVENT_PART';
var CT_CLIP = exports.CT_CLIP = 'CLIP';
var CT_TRAINING = exports.CT_TRAINING = 'TRAINING';
var CT_KITEI_MAKOR = exports.CT_KITEI_MAKOR = 'KITEI_MAKOR';

// Source Types
var SRC_COLLECTION = exports.SRC_COLLECTION = 'COLLECTION';
var SRC_BOOK = exports.SRC_BOOK = 'BOOK';
var SRC_VOLUME = exports.SRC_VOLUME = 'VOLUME';
var SRC_PART = exports.SRC_PART = 'PART';
var SRC_PARASHA = exports.SRC_PARASHA = 'PARASHA';
var SRC_CHAPTER = exports.SRC_CHAPTER = 'CHAPTER';
var SRC_ARTICLE = exports.SRC_ARTICLE = 'ARTICLE';
var SRC_TITLE = exports.SRC_TITLE = 'TITLE';
var SRC_LETTER = exports.SRC_LETTER = 'LETTER';
var SRC_ITEM = exports.SRC_ITEM = 'ITEM';

// Languages
var LANG_HEBREW = exports.LANG_HEBREW = 'he';
var LANG_ENGLISH = exports.LANG_ENGLISH = 'en';
var LANG_RUSSIAN = exports.LANG_RUSSIAN = 'ru';
var LANG_SPANISH = exports.LANG_SPANISH = 'es';
var LANG_ITALIAN = exports.LANG_ITALIAN = 'it';
var LANG_GERMAN = exports.LANG_GERMAN = 'de';
var LANG_DUTCH = exports.LANG_DUTCH = 'nl';
var LANG_FRENCH = exports.LANG_FRENCH = 'fr';
var LANG_PORTUGUESE = exports.LANG_PORTUGUESE = 'pt';
var LANG_TURKISH = exports.LANG_TURKISH = 'tr';
var LANG_POLISH = exports.LANG_POLISH = 'pl';
var LANG_ARABIC = exports.LANG_ARABIC = 'ar';
var LANG_HUNGARIAN = exports.LANG_HUNGARIAN = 'hu';
var LANG_FINNISH = exports.LANG_FINNISH = 'fi';
var LANG_LITHUANIAN = exports.LANG_LITHUANIAN = 'lt';
var LANG_JAPANESE = exports.LANG_JAPANESE = 'ja';
var LANG_BULGARIAN = exports.LANG_BULGARIAN = 'bg';
var LANG_GEORGIAN = exports.LANG_GEORGIAN = 'ka';
var LANG_NORWEGIAN = exports.LANG_NORWEGIAN = 'no';
var LANG_SWEDISH = exports.LANG_SWEDISH = 'sv';
var LANG_CROATIAN = exports.LANG_CROATIAN = 'hr';
var LANG_CHINESE = exports.LANG_CHINESE = 'zh';
var LANG_PERSIAN = exports.LANG_PERSIAN = 'fa';
var LANG_ROMANIAN = exports.LANG_ROMANIAN = 'ro';
var LANG_HINDI = exports.LANG_HINDI = 'hi';
var LANG_UKRAINIAN = exports.LANG_UKRAINIAN = 'ua';
var LANG_MACEDONIAN = exports.LANG_MACEDONIAN = 'mk';
var LANG_SLOVENIAN = exports.LANG_SLOVENIAN = 'sl';
var LANG_LATVIAN = exports.LANG_LATVIAN = 'lv';
var LANG_SLOVAK = exports.LANG_SLOVAK = 'sk';
var LANG_CZECH = exports.LANG_CZECH = 'cs';
var LANG_UNKNOWN = exports.LANG_UNKNOWN = 'xx';

var LANGUAGES = exports.LANGUAGES = (_LANGUAGES = {}, _defineProperty(_LANGUAGES, LANG_HEBREW, { value: LANG_HEBREW, flag: 'il' }), _defineProperty(_LANGUAGES, LANG_ENGLISH, { value: LANG_ENGLISH, flag: 'us' }), _defineProperty(_LANGUAGES, LANG_RUSSIAN, { value: LANG_RUSSIAN, flag: 'ru' }), _defineProperty(_LANGUAGES, LANG_SPANISH, { value: LANG_SPANISH, flag: 'es' }), _defineProperty(_LANGUAGES, LANG_ITALIAN, { value: LANG_ITALIAN, flag: 'it' }), _defineProperty(_LANGUAGES, LANG_GERMAN, { value: LANG_GERMAN, flag: 'de' }), _defineProperty(_LANGUAGES, LANG_DUTCH, { value: LANG_DUTCH, flag: 'nl' }), _defineProperty(_LANGUAGES, LANG_FRENCH, { value: LANG_FRENCH, flag: 'fr' }), _defineProperty(_LANGUAGES, LANG_PORTUGUESE, { value: LANG_PORTUGUESE, flag: 'pt' }), _defineProperty(_LANGUAGES, LANG_TURKISH, { value: LANG_TURKISH, flag: 'tr' }), _defineProperty(_LANGUAGES, LANG_POLISH, { value: LANG_POLISH, flag: 'pl' }), _defineProperty(_LANGUAGES, LANG_ARABIC, { value: LANG_ARABIC, flag: 'sa' }), _defineProperty(_LANGUAGES, LANG_HUNGARIAN, { value: LANG_HUNGARIAN, flag: 'hu' }), _defineProperty(_LANGUAGES, LANG_FINNISH, { value: LANG_FINNISH, flag: 'fi' }), _defineProperty(_LANGUAGES, LANG_LITHUANIAN, { value: LANG_LITHUANIAN, flag: 'lt' }), _defineProperty(_LANGUAGES, LANG_JAPANESE, { value: LANG_JAPANESE, flag: 'jp' }), _defineProperty(_LANGUAGES, LANG_BULGARIAN, { value: LANG_BULGARIAN, flag: 'bg' }), _defineProperty(_LANGUAGES, LANG_GEORGIAN, { value: LANG_GEORGIAN, flag: 'ge' }), _defineProperty(_LANGUAGES, LANG_NORWEGIAN, { value: LANG_NORWEGIAN, flag: 'no' }), _defineProperty(_LANGUAGES, LANG_SWEDISH, { value: LANG_SWEDISH, flag: 'se' }), _defineProperty(_LANGUAGES, LANG_CROATIAN, { value: LANG_CROATIAN, flag: 'hr' }), _defineProperty(_LANGUAGES, LANG_CHINESE, { value: LANG_CHINESE, flag: 'cn' }), _defineProperty(_LANGUAGES, LANG_PERSIAN, { value: LANG_PERSIAN, flag: 'ir' }), _defineProperty(_LANGUAGES, LANG_ROMANIAN, { value: LANG_ROMANIAN, flag: 'ro' }), _defineProperty(_LANGUAGES, LANG_HINDI, { value: LANG_HINDI, flag: 'in' }), _defineProperty(_LANGUAGES, LANG_UKRAINIAN, { value: LANG_UKRAINIAN, flag: 'ua' }), _defineProperty(_LANGUAGES, LANG_MACEDONIAN, { value: LANG_MACEDONIAN, flag: 'mk' }), _defineProperty(_LANGUAGES, LANG_SLOVENIAN, { value: LANG_SLOVENIAN, flag: 'si' }), _defineProperty(_LANGUAGES, LANG_LATVIAN, { value: LANG_LATVIAN, flag: 'lv' }), _defineProperty(_LANGUAGES, LANG_SLOVAK, { value: LANG_SLOVAK, flag: 'sk' }), _defineProperty(_LANGUAGES, LANG_CZECH, { value: LANG_CZECH, flag: 'cz' }), _LANGUAGES);

var FLAG_TO_LANGUAGE = exports.FLAG_TO_LANGUAGE = Object.values(LANGUAGES).reduce(function (acc, language) {
  acc[language.flag] = language.value;
  return acc;
}, {});

var ALL_LANGUAGES = exports.ALL_LANGUAGES = [LANG_HEBREW, LANG_ENGLISH, LANG_RUSSIAN, LANG_SPANISH, LANG_ITALIAN, LANG_GERMAN, LANG_DUTCH, LANG_FRENCH, LANG_PORTUGUESE, LANG_TURKISH, LANG_POLISH, LANG_ARABIC, LANG_HUNGARIAN, LANG_FINNISH, LANG_LITHUANIAN, LANG_JAPANESE, LANG_BULGARIAN, LANG_GEORGIAN, LANG_NORWEGIAN, LANG_SWEDISH, LANG_CROATIAN, LANG_CHINESE, LANG_PERSIAN, LANG_ROMANIAN, LANG_HINDI, LANG_UKRAINIAN, LANG_MACEDONIAN, LANG_SLOVENIAN, LANG_LATVIAN, LANG_SLOVAK, LANG_CZECH];

var DEFAULT_LANGUAGE = exports.DEFAULT_LANGUAGE = LANG_ENGLISH;

var RTL_LANGUAGES = exports.RTL_LANGUAGES = [LANG_HEBREW, LANG_ARABIC, LANG_PERSIAN];

var LANGUAGE_OPTIONS = exports.LANGUAGE_OPTIONS = ALL_LANGUAGES.map(function (x) {
  return LANGUAGES[x];
});

var MT_VIDEO = exports.MT_VIDEO = 'video';
var MT_AUDIO = exports.MT_AUDIO = 'audio';
var MT_IMAGE = exports.MT_IMAGE = 'image';
var MT_TEXT = exports.MT_TEXT = 'text';
var MT_SHEET = exports.MT_SHEET = 'sheet';
var MT_BANNER = exports.MT_BANNER = 'banner';
var MT_PRESENTATION = exports.MT_PRESENTATION = 'presentation';

var PLAYABLE_MEDIA_TYPES = exports.PLAYABLE_MEDIA_TYPES = [MT_VIDEO, MT_AUDIO];

var MEDIA_TYPES = exports.MEDIA_TYPES = {
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
  pps: { type: MT_PRESENTATION, sub_type: '', mime_type: 'application/vnd.ms-powerpoint' }
};

var MIME_TYPE_TO_MEDIA_TYPE = exports.MIME_TYPE_TO_MEDIA_TYPE = Object.values(MEDIA_TYPES).reduce(function (acc, mediaInfo) {
  acc[mediaInfo.mime_type] = mediaInfo.type;
  return acc;
}, {});

var TAG_LESSONS_TOPICS = exports.TAG_LESSONS_TOPICS = 'mS7hrYXK';
var TAG_PROGRAMS_TOPICS = exports.TAG_PROGRAMS_TOPICS = 'IgSeiMLj';

var DATE_FORMAT = exports.DATE_FORMAT = 'YYYY-MM-DD';

var EVENT_TYPES = exports.EVENT_TYPES = [CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY];