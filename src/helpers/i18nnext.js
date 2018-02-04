import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import moment from 'moment';
import 'moment/locale/he';
import 'moment/locale/ru';
import { DEFAULT_LANGUAGE } from './consts';
import { initialLng } from './i18n-utils';

// import Cache from 'i18next-localstorage-cache';
// import LanguageDetector from 'i18next-browser-languagedetector';
const LOCALES_BACKEND = process.env.NODE_ENV === 'production' ?
  process.env.PUBLIC_URL :
  process.env.REACT_APP_LOCALES_BACKEND;

// Initialize moment global locale to default language
moment.locale(initialLng());

i18n
  .use(XHR)
  // .use(Cache)
  .use(LanguageDetector)
  .init({

    backend: {
      // ?need fallback if a file doesn't exist
      loadPath: `${LOCALES_BACKEND}/locales/{{lng}}/{{ns}}.json`,
      crossDomain: true
    },
    // no region specific locals like en-US
    load: 'languageOnly',
    fallbackLng: DEFAULT_LANGUAGE,

    react: {
      wait: true, // globally set to wait for loaded translations in translate hoc
      // exposeNamespace: true // exposes namespace on data-i18next-options to be used in eg. locize-editor
    },

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react!!
      format: (value, format) => {
        if (value instanceof Date) {
          return moment(value).format(format);
        }
        return value;
      },
    },

    detection: {
      order: ['localStorage', 'cookie', 'navigator'],

      lookupCookie: 'i18nextLng',
      lookupLocalStorage: 'i18nextLng',

      // cache user language on
      caches: ['localStorage', 'cookie'],

      // optional expire and domain for set cookie
      // cookieMinutes: 0,
      // cookieDomain: 'myDomain',
    },
    // cache: {
    //   enabled: true
    // },
  });

export default i18n;
