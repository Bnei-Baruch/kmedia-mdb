import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import { DEFAULT_LANGUAGE } from './consts';
// import Cache from 'i18next-localstorage-cache';
// import LanguageDetector from 'i18next-browser-languagedetector';

const LOCALES_BACKEND = process.env.NODE_ENV === 'production' ?
  process.env.PUBLIC_URL :
  process.env.REACT_APP_LOCALES_BACKEND;

i18n
  .use(XHR)
  // .use(Cache)
  // .use(LanguageDetector)
  .init({

    backend: {
      loadPath: `${LOCALES_BACKEND}/locales/{{lng}}/{{ns}}.json`,
      crossDomain: true
    },

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
      format: function (value, format, lng) {
        if (value instanceof Date) {
          return new Intl.DateTimeFormat(lng).format(value);
        }
        return value;
      }
    },

    // cache: {
    //   enabled: true
    // },
  });

export default i18n;
